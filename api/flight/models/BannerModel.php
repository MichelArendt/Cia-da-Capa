<?php

namespace Models;

use PDO;
use Exception;
use Flight;
use Helpers\FileHelper;

/**
 * Model for banner management and business logic.
 */
class BannerModel
{
    private $db;
    private $table;
    private $maxFileSize;

    public function __construct()
    {
        $this->db = Flight::get('db');
        $this->table = Flight::get('tables')['banners'];
        $this->maxFileSize = Flight::get('upload-image__max-file-size');
    }

    /**
     * Create the banners table if not exists.
     */
    public function createTableIfNotExists()
    {
        $sql = "
            CREATE TABLE IF NOT EXISTS `{$this->table}` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                file_path_mobile VARCHAR(255) NOT NULL,
                file_path_tablet VARCHAR(255) NOT NULL,
                file_path_desktop VARCHAR(255) NOT NULL,
                priority INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES `products`(id) ON DELETE CASCADE
            );
        ";
        $this->db->exec($sql);

        // Auto-increment priority trigger
        $triggerName = "before_insert_{$this->table}";
        $check = $this->db->prepare("
            SELECT TRIGGER_NAME FROM INFORMATION_SCHEMA.TRIGGERS
            WHERE TRIGGER_SCHEMA = DATABASE() AND TRIGGER_NAME = :name
        ");
        $check->execute([':name' => $triggerName]);

        if (!$check->fetch()) {
            $this->db->exec("
                CREATE TRIGGER $triggerName
                BEFORE INSERT ON `{$this->table}`
                FOR EACH ROW
                BEGIN
                    DECLARE max_priority INT;
                    SELECT COALESCE(MAX(priority), 0) + 1 INTO max_priority FROM `{$this->table}`;
                    SET NEW.priority = max_priority;
                END;
            ");
        }
    }

    /**
     * Create a new banner, uploading 3 images to /images/banners/{id}/id-{resolution}.webp.
     * Only commit to DB if all uploads succeed; cleans up on failure.
     *
     * @param int $productId
     * @param string $title
     * @param array $images ['mobile'=>$_FILES, 'tablet'=>$_FILES, 'desktop'=>$_FILES]
     * @return array ['success'=>bool, 'error'=>?string]
     */
    public function createBanner(int $productId, string $title, array $images): array
    {
        try {
            // 1. Insert the banner row first, to get the ID for its folder
            $stmt = $this->db->prepare("INSERT INTO `{$this->table}` (product_id, title, file_path_mobile, file_path_tablet, file_path_desktop) VALUES (:title, '', '', '')");
            $ok = $stmt->execute([':product_id' => $productId, ':title' => $title]);

            if (!$ok) return ['success' => false, 'error' => 'Erro ao inserir no banco (pré-upload).'];
            $bannerId = $this->db->lastInsertId();

            // 2. Prepare expected file naming and sizes for each resolution
            $resolutions = [
                'mobile' => [640, 360, '-mobile'],
                'tablet' => [1024, 512, '-tablet'],
                'desktop' => [1920, 600, '-desktop'],
            ];
            $paths = [];

            // 3. Upload/process each image with custom names (id-mobile, etc)
            foreach ($resolutions as $size => [$w, $h, $suf]) {
                $up = FileHelper::handleImageUpload(
                    $images[$size],
                    "banners/$bannerId",
                    [
                        'max_size' => $this->maxFileSize,
                        'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
                        'generate_webp' => true,
                        'resize' => [[$w, $h, '']],
                        'custom_names' => [0 => "id$suf"] // index 0, since each field is single
                    ]
                );
                if (!empty($up['errors'])) {
                    $this->deleteBannerFiles($bannerId); // Remove files/folder
                    $this->delete($bannerId);            // Remove DB row
                    return ['success' => false, 'error' => "Falha ao processar imagem '$size': " . $up['errors'][0]['error']];
                }
                $paths[$size] = $up['success'][0]['webp'];
            }

            // 4. Update DB with file paths, only after all uploads succeed
            $stmt = $this->db->prepare("
                UPDATE `{$this->table}` SET
                file_path_mobile = :mobile,
                file_path_tablet = :tablet,
                file_path_desktop = :desktop
                WHERE id = :id
            ");
            $ok = $stmt->execute([
                ':mobile' => $paths['mobile'],
                ':tablet' => $paths['tablet'],
                ':desktop' => $paths['desktop'],
                ':id' => $bannerId
            ]);
            if (!$ok) {
                $this->deleteBannerFiles($bannerId);
                $this->delete($bannerId);
                return ['success' => false, 'error' => 'Erro ao salvar imagens no banco.'];
            }
            return ['success' => true, 'error' => null];
        } catch (Exception $e) {
            return ['success' => false, 'error' => "Exceção: " . $e->getMessage()];
        }
    }

    /**
     * Update a single banner image (mobile/tablet/desktop), overwriting the existing file.
     *
     * @param int $bannerId
     * @param string $sizeKey  'mobile', 'tablet', or 'desktop'
     * @param array $file      The $_FILES entry
     * @return array ['success'=>bool, 'error'=>?string]
     */
    public function updateBannerImage($bannerId, string $sizeKey, $file): array
    {
        $sizeMap = [
            'mobile' => [640, 360, '-mobile', 'file_path_mobile'],
            'tablet' => [1024, 512, '-tablet', 'file_path_tablet'],
            'desktop' => [1920, 600, '-desktop', 'file_path_desktop'],
        ];
        if (!isset($sizeMap[$sizeKey])) {
            return ['success' => false, 'error' => "Tamanho inválido."];
        }
        [$w, $h, $suf, $dbField] = $sizeMap[$sizeKey];

        // Get current banner and old file path
        $banner = $this->getById($bannerId);
        if (!$banner) return ['success' => false, 'error' => "Banner não encontrado."];

        // Process upload (always id-mobile.webp, etc)
        $uploadResult = \Helpers\FileHelper::handleImageUpload(
            $file,
            "banners/$bannerId",
            [
                'max_size' => $this->maxFileSize,
                'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp'],
                'generate_webp' => true,
                'resize' => [[$w, $h, '']],
                'custom_names' => [0 => "id$suf"]
            ]
        );
        if (!empty($uploadResult['errors'])) {
            return ['success' => false, 'error' => $uploadResult['errors'][0]['error']];
        }
        $newPath = $uploadResult['success'][0]['webp'];

        // Remove the old file if exists
        $this->deleteBannerImageFile($banner[$dbField]);

        // Update DB with the new file path
        $stmt = $this->db->prepare("UPDATE `{$this->table}` SET {$dbField} = :path WHERE id = :id");
        $ok = $stmt->execute([
            ':path' => $newPath,
            ':id' => $bannerId
        ]);
        if (!$ok) {
            // Rollback file if DB update failed
            $this->deleteBannerImageFile($newPath);
            return ['success' => false, 'error' => "Falha ao atualizar banco de dados."];
        }

        return ['success' => true, 'error' => null];
    }

    /**
     * Update the ordering of banners.
     */
    public function updateOrdering(array $orderData)
    {
        $ids = [];
        $cases = '';

        foreach ($orderData as $item) {
            $ids[] = (int)$item['id'];
            $cases .= " WHEN {$item['id']} THEN {$item['priority']} ";
        }

        $idsList = implode(',', $ids);
        $sql = "UPDATE `{$this->table}` SET priority = CASE id $cases END WHERE id IN ($idsList)";

        return $this->db->prepare($sql)->execute();
    }

    /**
     * Get all banners ordered by priority.
     */
    public function getAll()
    {
        $stmt = $this->db->query("SELECT * FROM `{$this->table}` ORDER BY priority ASC");

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get a banner by id.
     */
    public function getById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM `{$this->table}` WHERE id = :id");
        $stmt->execute([':id' => $id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Deletes a banner image file from disk, given its DB path (public path, e.g. "/images/banners/1/id-mobile.webp").
     * Safe to call even if the file does not exist.
     *
     * @param string|null $publicPath
     */
    private function deleteBannerImageFile($publicPath)
    {
        // Only proceed if a path is provided
        if ($publicPath) {
            // Convert public path to absolute path on disk
            $filePath = (defined('WEBSITE_ROOT') ? WEBSITE_ROOT : dirname(__DIR__, 2)) . $publicPath;
            // Remove file if it exists
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
    }


    /**
     * Remove all banner images under /images/banners/{id}/.
     */
    private function deleteBannerFiles($bannerId)
    {
        $dir = (defined('WEBSITE_ROOT') ? WEBSITE_ROOT : dirname(__DIR__, 2)) . "/images/banners/$bannerId";
        if (is_dir($dir)) {
            array_map('unlink', glob("$dir/*"));
            rmdir($dir);
        }
    }

    /**
     * Delete banner row and its images (public API).
     */
    public function delete($id)
    {
        $this->deleteBannerFiles($id);
        $stmt = $this->db->prepare("DELETE FROM `{$this->table}` WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
