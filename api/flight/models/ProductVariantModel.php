<?php
namespace Models;

use PDO;
use Exception;

class ProductVariantModel {
  private $db;

  public function __construct(PDO $db) {
      $this->db = $db;
      $this->createTableIfNotExists();
  }

  // Check if the table exists and create it if necessary
  private function createTableIfNotExists() {
      $query = "
          CREATE TABLE IF NOT EXISTS product_variants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            variant_name VARCHAR(255) NOT NULL,
            variant_title VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            UNIQUE (product_id, variant_name)
          )";

      $this->db->exec($query);
  }

  // Fetch all products
  public function getVariantsForProductWithId($id): array {
      try {
          $stmt = $this->db->prepare("SELECT * FROM product_variants WHERE product_id = :product_id");
          $stmt->execute([':product_id' => $id]);
          return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
      } catch (Exception $e) {
          error_log("Database Error in ProductVariantModel->getVariantsForProductWithId(): " . $e->getMessage());
          return null;
      }
  }
}
?>