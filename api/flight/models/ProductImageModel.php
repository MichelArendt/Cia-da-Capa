<?php

namespace Models;

use PDO;
use Flight;
use Exception;
use Helpers\FileHelper;
use Helpers\HttpResponse;

/**
 * Model for managing product and product variant images,
 * including upload, deletion, and priority ordering.
 */
class ProductImageModel
{
    private $db;
    private $table;
    private $table_product;
    private $table_product_variants;
    private $maxFileSize;

    public function __construct()
    {
        $this->db = Flight::get('db');
        $this->table = Flight::get('tables')['product_images'];
        $this->table_product = Flight::get('tables')['products'];
        $this->table_product_variants = Flight::get('tables')['product_variants'];
        $this->maxFileSize = Flight::get('upload-image__max-file-size');
    }

    /**
     * Create the product_images table and the auto-priority trigger if they don't exist.
     */
    public function createTableIfNotExists()
    {
        $query = "
          CREATE TABLE IF NOT EXISTS `{$this->table}` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NULL,
            product_variant_id INT NULL,
            file_path VARCHAR(255) NOT NULL,
            thumbnail_file_path VARCHAR(255) NOT NULL,
            medium_file_path VARCHAR(255) NOT NULL,
            priority INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            FOREIGN KEY (product_id) REFERENCES `{$this->table_product}`(id) ON DELETE CASCADE,
            FOREIGN KEY (product_variant_id) REFERENCES `{$this->table_product_variants}`(id) ON DELETE CASCADE,

            CONSTRAINT ck_product_variant_exclusive
                CHECK (
                (product_id IS NOT NULL AND product_variant_id IS NULL)
                OR (product_id IS NULL AND product_variant_id IS NOT NULL)
                )
            );";

        $this->db->exec($query);

        // Create BEFORE INSERT Trigger for auto-increment priority if not exists
        try {
            $triggerName = 'before_insert_' . $this->table;
            $checkTrigger = $this->db->prepare("
                SELECT TRIGGER_NAME
                FROM INFORMATION_SCHEMA.TRIGGERS
                WHERE TRIGGER_SCHEMA = DATABASE()
                  AND TRIGGER_NAME = :triggerName
            ");
            $checkTrigger->execute([':triggerName' => $triggerName]);
            $exists = $checkTrigger->fetch();

            if (!$exists) {
                $triggerQuery = "
                    CREATE TRIGGER {$triggerName}
                    BEFORE INSERT ON `{$this->table}`
                    FOR EACH ROW
                    BEGIN
                        DECLARE max_priority INT;
                        SELECT COALESCE(MAX(priority), 0) + 1 INTO max_priority
                        FROM `{$this->table}`
                        WHERE (NEW.product_id IS NOT NULL AND product_id = NEW.product_id)
                            OR (NEW.product_variant_id IS NOT NULL AND product_variant_id = NEW.product_variant_id);
                        SET NEW.priority = max_priority;
                    END;
                ";
                $this->db->exec($triggerQuery);
            }
        } catch (\PDOException $e) {
            HttpResponse::handlePdoException($e, __METHOD__, "Trigger creation failed in ProductImageModel->createTableIfNotExists()");
        }
    }

    /**
     * Add multiple images to a product (no variant).
     * @param int $product_id
     * @param array $files  // $_FILES['files']
     * @return array ['success' => bool, 'files' => array, 'error' => ?string]
     */
    public function addImagesToProduct($product_id, $files)
    {
        return $this->addImages($product_id, null, $files);
    }

    /**
     * Add multiple images to a product variant.
     * @param int $variant_id
     * @param array $files  // $_FILES['files']
     * @return array ['success' => bool, 'files' => array, 'error' => ?string]
     */
    public function addImagesToVariant($variant_id, $files)
    {
        return $this->addImages(null, $variant_id, $files);
    }

    /**
     * Internal logic to add images to either a product or a variant.
     * Handles all validation, uses FileHelper, and inserts images into DB.
     * @param int|null $product_id
     * @param int|null $variant_id
     * @param array $files
     * @return array
     */
    private function addImages($product_id, $variant_id, $files)
    {
        $results = [
            'success' => false,
            'files' => [],
            'error' => null,
        ];

        // Decide upload folder
        $baseDir = $variant_id === null
            ? "products/{$product_id}"
            : "products/{$product_id}/variants/{$variant_id}";

        // Upload using the generic helper
        $uploadResult = FileHelper::handleImageUpload(
            $files,
            $baseDir,
            [
                'max_size' => $this->maxFileSize,
                'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
                'generate_webp' => true,
                'resize' => [
                    [150, 150, '-thumbnail'],
                    [800, 800, '-medium'],
                ]
            ]
        );

        // If any upload error, return immediately
        if (!empty($uploadResult['errors'])) {
            $results['error'] = $uploadResult['errors'][0]['error'];
            return $results;
        }

        // For each successful upload, add to DB and collect for response
        foreach ($uploadResult['success'] as $img) {
            $inserted = $this->addImage([
                'file_path' => $img['webp'],
                'thumbnail_file_path' => $img['webp-thumbnail'] ?? '',
                'medium_file_path' => $img['webp-medium'] ?? '',
                'product_id' => $product_id,
                'product_variant_id' => $variant_id
            ]);
            if ($inserted) {
                $results['files'][] = $img;
            }
        }
        $results['success'] = !empty($results['files']);
        return $results;
    }

    /**
     * Insert a single image record into the DB.
     * @param array $data
     * @return bool
     */
    public function addImage($data)
    {
        try {
            $query = "INSERT INTO `{$this->table}` (product_id, product_variant_id, file_path, thumbnail_file_path, medium_file_path) VALUES (:product_id, :product_variant_id, :file_path, :thumbnail_file_path, :medium_file_path)";
            $stmt = $this->db->prepare($query);

            return $stmt->execute([
                ':product_id' => $data['product_id'],
                ':product_variant_id' => $data['product_variant_id'],
                ':file_path' => $data['file_path'],
                ':thumbnail_file_path' => $data['thumbnail_file_path'],
                ':medium_file_path' => $data['medium_file_path'],
            ]);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->addImage()");
        }
    }

    /**
     * Get all images for a product.
     */
    public function getForProductId($product_id)
    {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM `{$this->table}`
                WHERE product_id = :product_id
                ORDER BY priority ASC"
            );
            $stmt->execute([':product_id' => $product_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->getForProductId()");
        }
    }

    /**
     * Get all images for a variant.
     */
    public function getForVariantId($product_variant_id)
    {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM `{$this->table}`
                WHERE product_variant_id = :product_variant_id
                ORDER BY priority ASC"
            );
            $stmt->execute([':product_variant_id' => $product_variant_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->getForVariantId()");
        }
    }

    /**
     * Get an image by its ID.
     */
    public function getById($image_id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM `{$this->table}` WHERE id = :id");
            $stmt->execute([':id' => $image_id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->getById()");
        }
    }

    /**
     * Delete an image by its ID and reorder priorities.
     */
    public function deleteForIdAndReorderPriorities($image_id)
    {
        try {
            $this->db->beginTransaction();
            $stmt = $this->db->prepare("SELECT * FROM `{$this->table}` WHERE id = :id");
            $stmt->execute([':id' => $image_id]);
            $image = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$image) {
                throw new Exception("Image not found.");
            }

            // Delete image files
            $this->deleteImageFile($image['file_path']);
            $this->deleteImageFile($image['thumbnail_file_path']);
            $this->deleteImageFile($image['medium_file_path']);

            // Delete the DB record
            $stmt = $this->db->prepare("DELETE FROM `{$this->table}` WHERE id = :id");
            $stmt->execute([':id' => $image_id]);

            // Reorder priorities for remaining images
            if (!empty($image['product_id'])) {
                $sql = "UPDATE `{$this->table}`
                    SET priority = priority - 1
                    WHERE product_id = :product_id AND priority > :deleted_priority";
                $params = [
                    ':product_id' => $image['product_id'],
                    ':deleted_priority' => $image['priority']
                ];
            } elseif (!empty($image['product_variant_id'])) {
                $sql = "UPDATE `{$this->table}`
                    SET priority = priority - 1
                    WHERE product_variant_id = :product_variant_id AND priority > :deleted_priority";
                $params = [
                    ':product_variant_id' => $image['product_variant_id'],
                    ':deleted_priority' => $image['priority']
                ];
            } else {
                $this->db->commit();
                return true;
            }

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->deleteForIdAndReorderPriorities()");
        }
    }

    /**
     * Deletes an image file from the server if it exists.
     */
    private function deleteImageFile(string $filePath)
    {
        if (!empty($filePath)) {
            $fullPath = defined('WEBSITE_ROOT') ? WEBSITE_ROOT . $filePath : $filePath;
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
        }
    }

    /**
     * Update the ordering (priority) for a set of image IDs.
     */
    public function updateOrdering(array $orderData)
    {
        try {
            if (empty($orderData)) {
                throw new Exception("No ordering data provided");
            }
            $ids = [];
            $caseSql = "";
            foreach ($orderData as $item) {
                if (!isset($item['id']) || !isset($item['priority'])) {
                    throw new Exception("Missing id or priority in one or more items");
                }
                $id = (int)$item['id'];
                $priority = (int)$item['priority'];
                $ids[] = $id;
                $caseSql .= " WHEN {$id} THEN {$priority} ";
            }
            $idsList = implode(', ', $ids);
            $sql = "UPDATE `{$this->table}` SET priority = CASE id {$caseSql} END WHERE id IN ({$idsList})";
            $stmt = $this->db->prepare($sql);
            return $stmt->execute();
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->updateOrdering()");
        }
    }
}
