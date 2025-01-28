<?php
namespace Models;

use PDO;
use Exception;

class ProductSizeModel {
  private $db;

  public function __construct(PDO $db) {
      $this->db = $db;
      $this->createTableIfNotExists();
  }

  // ✅ Check if the table exists and create it if necessary
  private function createTableIfNotExists() {
      $query = "
          CREATE TABLE IF NOT EXISTS product_sizes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            size_label_id INT NOT NULL,
            width FLOAT NOT NULL,
            height FLOAT NOT NULL,
            depth FLOAT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (size_label_id) REFERENCES product_size_labels(id) ON DELETE CASCADE
          )";

      $this->db->exec($query);
  }

  // Fetch all products
  public function getAll(): array {
      try {
          $stmt = $this->db->prepare("SELECT * FROM product_sizes");
          $stmt->execute();
          return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []; // Ensure an empty array if no results
      } catch (Exception $e) {
          error_log("Database Error in ProductSizeModel->getAll(): " . $e->getMessage());
          return null;
      }
  }
}
?>