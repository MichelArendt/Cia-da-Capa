<?php

namespace Models;

use PDO;
use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductImageModel
{
    private $db;

    public function __construct()
    {
        $this->db = Flight::get('db');
    }

    // Check if the table exists and create it if necessary
    public function createTableIfNotExists()
    {
        $query = "
          CREATE TABLE IF NOT EXISTS product_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NULL,
            product_variant_id INT NULL,
            file_path VARCHAR(255) NOT NULL,
            thumbnail_file_path VARCHAR(255) NOT NULL,
            medium_file_path VARCHAR(255) NOT NULL,
            priority INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,

            CONSTRAINT ck_product_variant_exclusive
                CHECK (
                (product_id IS NOT NULL AND product_variant_id IS NULL)
                OR (product_id IS NULL AND product_variant_id IS NOT NULL)
                )
            );";

        $this->db->exec($query);

        // Check if the trigger already exists by querying INFORMATION_SCHEMA.
        // Then create it only if not found.
        try {
            $checkTrigger = $this->db->prepare("
                SELECT TRIGGER_NAME
                FROM INFORMATION_SCHEMA.TRIGGERS
                WHERE TRIGGER_SCHEMA = DATABASE()
                  AND TRIGGER_NAME = 'before_insert_product_images'
            ");
            $checkTrigger->execute();
            $exists = $checkTrigger->fetch();

            if (!$exists) {
                // Create BEFORE INSERT Trigger (Auto-Increment Priority)
                $triggerQuery = "
                    CREATE TRIGGER before_insert_product_images
                    BEFORE INSERT ON product_images
                    FOR EACH ROW
                    BEGIN
                        DECLARE max_priority INT;

                        -- Get the highest priority for the same product_id OR product_variant_id
                        SELECT COALESCE(MAX(priority), 0) + 1 INTO max_priority
                        FROM product_images
                        WHERE (NEW.product_id IS NOT NULL AND product_id = NEW.product_id)
                            OR (NEW.product_variant_id IS NOT NULL AND product_variant_id = NEW.product_variant_id);

                        -- Assign the next priority number
                        SET NEW.priority = max_priority;
                    END;
                ";

                $this->db->exec($triggerQuery);
            }

            // // If you want to forcibly recreate it, drop first
            // $this->db->exec("DROP TRIGGER IF EXISTS before_insert_product_images");
            // error_log('TRIGGER before_insert_product_images on product_images DROPPED');
        } catch (\PDOException $e) {
            HttpResponse::handlePdoException($e, __METHOD__, "Trigger creation failed in ProductImageModel->createTableIfNotExists()");
        }
    }

    public function addImage($data)
    {
        try {
            $query = "INSERT INTO product_images (product_id, product_variant_id, file_path, thumbnail_file_path, medium_file_path) VALUES (:product_id, :product_variant_id, :file_path, :thumbnail_file_path, :medium_file_path)";
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

    public function getForProductId($product_id)
    {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM product_images
                WHERE product_id = :product_id
                ORDER BY priority ASC"
            );
            $stmt->execute([':product_id' => $product_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->getForProductId()");
        }
    }

    public function getForVariantId($product_variant_id)
    {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM product_images
                WHERE product_variant_id = :product_variant_id
                ORDER BY priority ASC"
            );
            $stmt->execute([':product_variant_id' => $product_variant_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->getForVariantId()");
        }
    }

    public function getById($image_id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM product_images WHERE id = :id");
            $stmt->execute([':id' => $image_id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->getForId()");
        }
    }

    public function deleteForIdAndReorderPriorities($image_id)
    {
        try {
            // Start a transaction to ensure both deletion and reordering happen together.
            $this->db->beginTransaction();

            // 1. Retrieve the image record so we know which product/variant and the current priority.
            $stmt = $this->db->prepare("SELECT * FROM product_images WHERE id = :id");
            $stmt->execute([':id' => $image_id]);
            $image = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$image) {
                throw new Exception("Image not found.");
            }

            // 2. Delete actual image files from the filesystem
            $this->deleteImageFile($image['file_path']);
            $this->deleteImageFile($image['thumbnail_file_path']);
            $this->deleteImageFile($image['medium_file_path']);

            // 3. Delete the image record.
            $stmt = $this->db->prepare("DELETE FROM product_images WHERE id = :id");
            $stmt->execute([':id' => $image_id]);

            // 4. Determine the condition for reordering.
            // If this image is linked to a product:
            if (!empty($image['product_id'])) {
                $sql = "UPDATE product_images
                    SET priority = priority - 1
                    WHERE product_id = :product_id AND priority > :deleted_priority";
                $params = [
                    ':product_id' => $image['product_id'],
                    ':deleted_priority' => $image['priority']
                ];
            }
            // Else, if linked to a product variant:
            elseif (!empty($image['product_variant_id'])) {
                $sql = "UPDATE product_images
                    SET priority = priority - 1
                    WHERE product_variant_id = :product_variant_id AND priority > :deleted_priority";
                $params = [
                    ':product_variant_id' => $image['product_variant_id'],
                    ':deleted_priority' => $image['priority']
                ];
            } else {
                // In case neither field is set, commit deletion and return.
                $this->db->commit();
                return true;
            }

            // 5. Update the remaining images' priorities.
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            // Commit the transaction.
            $this->db->commit();
            return true;
        } catch (Exception $e) {
            // Rollback if something went wrong.
            $this->db->rollBack();
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->deleteImageAndReorder()");
        }
    }

    /**
     * Deletes an image file from the server if it exists.
     */
    private function deleteImageFile(string $filePath)
    {
        if (!empty($filePath) && file_exists($filePath)) {
            unlink($filePath);
        }
    }

    public function updateOrdering(array $orderData)
    {
        try {
            if (empty($orderData)) {
                throw new Exception("No ordering data provided");
            }

            $ids = [];
            $caseSql = "";

            // Build the CASE expression and collect the IDs.
            foreach ($orderData as $item) {
                if (!isset($item['id']) || !isset($item['priority'])) {
                    throw new Exception("Missing id or priority in one or more items");
                }
                $id = (int)$item['id'];
                $priority = (int)$item['priority'];
                $ids[] = $id;
                $caseSql .= " WHEN {$id} THEN {$priority} ";
            }

            // Create a comma-separated list of IDs for the WHERE clause.
            $idsList = implode(', ', $ids);

            // Build the final SQL statement.
            $sql = "UPDATE product_images SET priority = CASE id {$caseSql} END WHERE id IN ({$idsList})";

            // Prepare and execute the SQL statement.
            $stmt = $this->db->prepare($sql);
            return $stmt->execute();
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageModel->updateOrdering()");
        }
    }
}
