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

  // ✅ Check if the table exists and create it if necessary
  private function createTableIfNotExists() {
      $query = "
          CREATE TABLE IF NOT EXISTS product_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            product_variant_id INT NULL,
            file_path VARCHAR(255) NOT NULL,
            priority INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
          )";

      $this->db->exec($query);
  }

  // Fetch all products
  public function getAll(): array {
      try {
          $stmt = $this->db->prepare("SELECT * FROM product_images");
          $stmt->execute();
          return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []; // Ensure an empty array if no results
      } catch (Exception $e) {
          error_log("Database Error in ProductImageModel->getAll(): " . $e->getMessage());
          return null;
      }
  }
}
?>