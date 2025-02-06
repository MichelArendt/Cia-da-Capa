<?php
namespace Models;

use PDO;
use Exception;

class ProductImageModel {
  private $db;

  public function __construct(PDO $db) {
      $this->db = $db;
      $this->createTableIfNotExists();
  }

  // Check if the table exists and create it if necessary
  private function createTableIfNotExists() {
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

      // 🔹 Create Trigger (Separate Execution)
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

      // 🔹 Execute trigger creation separately
      try {
          $this->db->exec("DROP TRIGGER IF EXISTS before_insert_product_images"); // Ensure no duplicate trigger
          $this->db->exec($triggerQuery);
      } catch (\PDOException $e) {
            error_log("Trigger creation failed ProductImageModel->createTableIfNotExists(): " . $e->getMessage());
      }
  }

  public function addImage($data) {
      try {
          $query = "INSERT INTO product_images (product_id, file_path, thumbnail_file_path, medium_file_path) VALUES (:product_id, :file_path, :thumbnail_file_path, :medium_file_path)";
          $stmt = $this->db->prepare($query);

          return $stmt->execute([
              ':product_id' => $data['product_id'],
              ':file_path' => $data['file_path'],
              ':thumbnail_file_path' => $data['thumbnail_file_path'],
              ':medium_file_path' => $data['medium_file_path'],
          ]);
      } catch (Exception $e) {
          error_log("Database Error in ProductImageModel->addImage(): " . $e->getMessage());
          return false;
      }
  }

  public function getByProductId($product_id) {
      try {
          $stmt = $this->db->prepare("SELECT * FROM product_images WHERE product_id = :product_id");
          $stmt->execute([':product_id' => $product_id]);
          return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
      } catch (Exception $e) {
          error_log("Database Error in ProductImageModel->getByProductId(): " . $e->getMessage());
          return [];
      }
  }

  public function getById($image_id) {
      try {
          $stmt = $this->db->prepare("SELECT * FROM product_images WHERE id = :id");
          $stmt->execute([':id' => $image_id]);
          return $stmt->fetch(PDO::FETCH_ASSOC);
      } catch (Exception $e) {
          error_log("Database Error in ProductImageModel->getById(): " . $e->getMessage());
          return null;
      }
  }

  public function deleteById($image_id) {
      try {
          $stmt = $this->db->prepare("DELETE FROM product_images WHERE id = :id");
          return $stmt->execute([':id' => $image_id]);
      } catch (Exception $e) {
          error_log("Database Error in ProductImageModel->deleteById(): " . $e->getMessage());
          return false;
      }
  }
}
?>