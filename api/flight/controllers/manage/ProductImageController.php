<?php
namespace Controllers\Manage;

use Models\ProductImageModel;
use Exception;
use Flight;
use Helpers\ErrorHandler;

class ProductImageController {
    private $db;
    private $imageModel;
    private $maxFileSize;

    public function __construct($db) {
        $this->db = $db;
        $this->imageModel = Flight::get('productImageModel');
        Flight::get('upload-image__max-file-size'); // 5MB
    }

    /**
     * Upload an image for a specific product (no variant).
     */
    public function uploadImage($product_id)
    {
        // Just call the shared function with variantId = null
        $this->processUpload($product_id, null);
    }

    /**
     * Upload an image for a specific product *variant*.
     */
    public function uploadVariantImage($product_id, $variantId)
    {
        // We pass $variantId so it uses the variants subfolder
        $this->processUpload($product_id, $variantId);
    }

    /**
     * Common logic for reading $_FILES['file'], validating size/type,
     * converting to WebP, and storing DB record.
     *
     * @param int $productId
     * @param int|null $variantId If not null, store under productId/variants/variantId
     */
    private function processUpload($productId, $variantId)
    {
        try {
            // 1) Check if file is present
            if (!isset($_FILES['file'])) {
                Flight::json(['error' => 'No file uploaded'], 400);
                return;
            }

            $file = $_FILES['file'];

            // 2) Check size up to 5MB
            $maxFileSize = 5 * 1024 * 1024;
            if ($file['size'] > $maxFileSize) {
                Flight::json([
                    'error' => 'File exceeds 5MB limit'
                ], 400);
                return;
            }

            // 3) Determine actual MIME type (rather than trusting $file['type'])
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);

            $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!in_array($mimeType, $allowedMimes)) {
                Flight::json([
                    'error' => 'Invalid file type: ' . $mimeType
                ], 400);
                return;
            }

            // 4) Generate unique name (no collisions)
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $uniqueId = uniqid();

            // Full-size final name
            $webpName = $uniqueId . '.webp';

            // We'll also have a thumbnail and medium
            $thumbnailName = $uniqueId . '-thumbnail.webp';
            $mediumName = $uniqueId . '-medium.webp';

            // 5) Build final paths
            $uploadDir = Flight::get('upload-dir__product'); // e.g. /images/products
            if ($variantId === null) {
                // No variant
                $productDir = $uploadDir . '/' . $productId . '/';
            } else {
                // e.g. /images/products/123/variants/45/
                $productDir = $uploadDir . '/' . $productId . '/variants/' . $variantId . '/';
            }

            if (!is_dir($productDir)) {
                mkdir($productDir, 0777, true);
            }

            // We'll store the initially uploaded file here (temp)
            $originalFileName = $uniqueId . '.' . $ext;
            $originalFilePath = $productDir . $originalFileName;

            $webpFilePath   = $productDir . $webpName;
            $thumbnailFilePath  = $productDir . $thumbnailName;
            $mediumFilePath = $productDir . $mediumName;

            // error_log('originalFilePath: ' . $originalFilePath);
            // error_log('webpFilePath: ' . $webpFilePath);
            // error_log('thumbnailFilePath: ' . $thumbnailFilePath);
            // error_log('mediumFilePath: ' . $mediumFilePath);

            // die();

            // 6) Move the file to local storage
            if (!move_uploaded_file($file['tmp_name'], $originalFilePath)) {
                Flight::json(['error' => 'Failed to move uploaded file'], 500);
                return;
            }

            // 7) Load image with PHP-GD and remove original
            $gd = null;
            switch ($mimeType) {
                case 'image/jpeg':
                    $gd = imagecreatefromjpeg($originalFilePath);
                    break;
                case 'image/png':
                    $gd = imagecreatefrompng($originalFilePath);
                    break;
                case 'image/webp':
                    $gd = imagecreatefromwebp($originalFilePath);
                    break;
            }
            if (!$gd) {
                @unlink($originalFilePath);
                Flight::json(['error' => 'Unable to create image resource'], 500);
                return;
            }

            // 8) Generate the "full" WebP at quality ~80
            $quality = 80;
            if (imagewebp($gd, $webpFilePath, $quality) === false) {
                imagedestroy($gd);
                @unlink($originalFilePath);
                Flight::json(['error' => 'Failed to convert to WebP (full)'], 500);
                return;
            }

            // 8b) Generate THUMBNAIL (e.g. 300 px bounding)
            $gdThumbnail = $this->resizeGD($gd, 300); // 300 px on longest side
            if (imagewebp($gdThumbnail, $thumbnailFilePath, $quality) === false) {
                imagedestroy($gdThumbnail);
                imagedestroy($gd);
                @unlink($originalFilePath);
                Flight::json(['error' => 'Failed to create thumbnail'], 500);
                return;
            }
            imagedestroy($gdThumbnail);

            // 8c) Generate MEDIUM (e.g. 800 px bounding)
            $gdMedium = $this->resizeGD($gd, 800);
            if (imagewebp($gdMedium, $mediumFilePath, $quality) === false) {
                imagedestroy($gdMedium);
                imagedestroy($gd);
                @unlink($originalFilePath);
                Flight::json(['error' => 'Failed to create medium image'], 500);
                return;
            }
            imagedestroy($gdMedium);

            // Cleanup
            imagedestroy($gd);
            @unlink($originalFilePath); // We only keep .webp files

            // 9) Attempt DB insertion
            $imageData = [
                'priority' => 0,
                'file_path'         => $this->makePublicPath($productId, $variantId, $webpName),
                'thumbnail_file_path'   => $this->makePublicPath($productId, $variantId, $thumbnailName),
                'medium_file_path'  => $this->makePublicPath($productId, $variantId, $mediumName)
            ];

            if ($variantId === null) {
                $imageData['product_id'] = $productId;
                $imageData['product_variant_id'] = null;
            } else {
                $imageData['product_id'] = null;
                $imageData['product_variant_id'] = $variantId;
            }

            $success = $this->imageModel->addImage($imageData);
            if (!$success) {
                // DB insertion failed => remove the newly created webp files
                @unlink($webpFilePath);
                @unlink($thumbnailFilePath);
                @unlink($mediumFilePath);
                Flight::json(['error' => 'Database error when adding image'], 500);
                return;
            }

            // 10) Return success
            Flight::json([
                'success'   => true,
                'file_url'  => $this->makePublicPath($productId, $variantId, $webpName),
                'thumb_url' => $this->makePublicPath($productId, $variantId, $thumbnailName),
                'medium_url'=> $this->makePublicPath($productId, $variantId, $mediumName),
            ]);
        } catch (Exception $e) {
            error_log("Upload Error: " . $e->getMessage());
            Flight::json(['error' => 'Server error'], 500);
        }
    }

    /**
     * Helper to build the public file URL. E.g. "/images/products/123/variants/45/XYZ.webp"
     */
    private function makePublicPath($productId, $variantId, $fileName)
    {
        if ($variantId === null) {
            return "/images/products/$productId/$fileName";
        } else {
            return "/images/products/$productId/variants/$variantId/$fileName";
        }
    }

    /**
     * Helper function that resizes $gd to fit within $maxDim while preserving aspect ratio.
     * E.g. if $maxDim=800, a 1200x600 image becomes 800x400, a 500x1200 becomes 250x600, etc.
     */
    private function resizeGD($gdSource, $maxDim)
    {
        $origWidth  = imagesx($gdSource);
        $origHeight = imagesy($gdSource);

        // If the image is already smaller than $maxDim in both dimensions, skip
        if ($origWidth <= $maxDim && $origHeight <= $maxDim) {
            // Return a copy if you prefer, or just return the original
            // We'll do a copy in case we want to do separate processing
            $copy = imagecreatetruecolor($origWidth, $origHeight);
            imagecopy($copy, $gdSource, 0, 0, 0, 0, $origWidth, $origHeight);
            return $copy;
        }

        // Determine new width/height preserving ratio
        if ($origWidth >= $origHeight) {
            // Landscape or square
            $newWidth  = $maxDim;
            $newHeight = (int) round($origHeight * ($newWidth / $origWidth));
        } else {
            // Portrait
            $newHeight = $maxDim;
            $newWidth  = (int) round($origWidth * ($newHeight / $origHeight));
        }

        // Create new GD image
        $resized = imagecreatetruecolor($newWidth, $newHeight);
        // For PNG with transparency, you might want alpha blending:
        imagealphablending($resized, false);
        imagesavealpha($resized, true);

        // Copy + resample
        imagecopyresampled(
            $resized, $gdSource,
            0, 0, 0, 0,
            $newWidth, $newHeight,
            $origWidth, $origHeight
        );

        return $resized;
    }

    /**
     * Fetch all images associated with a given product ID.
     */
    public function getImagesForProductId($product_id)
    {
        try {
            $images = $this->imageModel->getForProductId($product_id);
            Flight::json(['success' => true, 'images' => $images]);
        } catch (Exception $e) {
            error_log("Error fetching images: " . $e->getMessage());
            Flight::json(['error' => 'Server error'], 500);
        }
    }

    /**
     * Delete an image by its ID.
     */
    public function deleteForIdAndReorderPriorities($image_id)
    {
        try {
            // Fetch image details before deletion
            $image = $this->imageModel->getForId($image_id);
            if (!$image) {
                Flight::json(['error' => 'Image not found'], 404);
                return;
            }

            // Delete the physical file from storage
            $filePath = WEBSITE_ROOT .  $image['file_path'];
            $thumbnailFilePath = WEBSITE_ROOT .  $image['thumbnail_file_path'];
            $mediumFilePath = WEBSITE_ROOT .  $image['medium_file_path'];

            if (file_exists($filePath)) {
                unlink($filePath);
            }

            if (file_exists($thumbnailFilePath)) {
                unlink($thumbnailFilePath);
            }

            if (file_exists($mediumFilePath)) {
                unlink($mediumFilePath);
            }

            // Remove the image record from the database
            $this->imageModel->deleteForIdAndReorderPriorities($image_id);
            Flight::json(['success' => true, 'message' => 'Image deleted successfully']);
        } catch (Exception $e) {
            error_log("Delete Error: " . $e->getMessage());
            Flight::json(['error' => 'Server error'], 500);
        }
    }

    /**
     * Update the ordering (priority) of multiple images.
     *
     * Expects a JSON payload like:
     * [
     *     {"id":54,"priority":1},
     *     {"id":50,"priority":2},
     *     {"id":51,"priority":3},
     *     {"id":52,"priority":4},
     *     {"id":49,"priority":5},
     *     {"id":53,"priority":6}
     * ]
     */
    public function updateOrdering() {
        try {
            // Decode incoming JSON request
            $data = json_decode(file_get_contents("php://input"), true);

            // Detect if the data is double-encoded as a string
            if (is_string($data)) {
                $data = json_decode($data, true);
            }

            // ErrorHandler::logError("Invalid data provided 1: " . json_encode($data), __METHOD__, 400);

            // Convert to an array (in case it's an object)
            // $dataArray = $data->getData();
            // ErrorHandler::logError("Invalid data provided 2: " . json_encode($dataArray), __METHOD__, 400);

            // Validate that we received a non-empty array of items
            if (!is_array($data) || empty($data)) {
                ErrorHandler::logError("Invalid data provided: " . json_encode($data), __METHOD__, 400);
                return;
            }

            // Validate that each item has both 'id' and 'priority'
            foreach ($data as $item) {
                if (!isset($item['id']) || !isset($item['priority'])) {
                    ErrorHandler::logError("Missing id or priority in one or more items", __METHOD__, 400);
                    return;
                }
            }

            // Call the model method to update ordering
            $result = $this->imageModel->updateOrdering($data);

            if ($result) {
                Flight::json(['success' => true, 'message' => 'Ordering updated successfully']);
            } else {
                ErrorHandler::logError("Database error when updating ordering", __METHOD__, 500);
            }
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__);
        }
    }

}
