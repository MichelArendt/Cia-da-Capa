<?php
namespace Models;

use PDO;
use Exception;

class ProductSizeLabelModel {
  private $db;

  public function __construct(PDO $db) {
      $this->db = $db;
      $this->createTableIfNotExists();
  }

  // Check if the table exists and create it if necessary
  private function createTableIfNotExists() {
      $query = "
          CREATE TABLE IF NOT EXISTS product_size_labels (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            label VARCHAR(50) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )";

      $this->db->exec($query);
  }

  // Fetch all product size labels
  public function getAll(): array {
      try {
          $stmt = $this->db->prepare("SELECT * FROM product_size_labels");
          $stmt->execute();
          return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []; // Ensure an empty array if no results
      } catch (Exception $e) {
          error_log("Database Error in ProductSizeLabelModel->getAll(): " . $e->getMessage());
          return null;
      }
  }

  // create product size label
  public function create(string $name, string $label): ?int {
    try {
        $stmt = $this->db->prepare("
            INSERT INTO product_size_labels (name, label, created_at, updated_at)
            VALUES (:name, :label, NOW(), NOW())"
        );

        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':label', $label, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            throw new Exception("Failed to insert product size label.");
        }

        return (int) $this->db->lastInsertId();
    } catch (Exception $e) {
        error_log("Database Error in ProductSizeLabelModel->create(): " . $e->getMessage());
        return null;
    }
  }

  // Delete product size label by ID
  public function delete($id) {
      try {
          // Check if the size label exists
          $stmt = $this->db->prepare("SELECT id FROM product_size_labels WHERE id = ?");
          $stmt->execute([$id]);
          if (!$stmt->fetch()) {
              throw new Exception("Size label not found.");
          }

          // Check if there are any products associated with this size label
          $stmt = $this->db->prepare("SELECT COUNT(*) as product_count FROM product_sizes WHERE size_label_id = ?");
          $stmt->execute([$id]);
          $productCount = $stmt->fetch(PDO::FETCH_ASSOC)['product_count'] ?? 0;

          if ($productCount > 0) {
              throw new Exception("Cannot delete size label. There are $productCount products linked to this size label.");
          }

          // Delete the category
          $stmt = $this->db->prepare("DELETE FROM product_size_labels WHERE id = ?");
          $stmt->execute([$id]);

          http_response_code(200);
          echo json_encode(["message" => "Product size label deleted successfully."]);
          return true;
      } catch (Exception $e) {
          error_log("Error deleting ProductSizeLabelModel->delete: " . $e->getMessage());
          http_response_code(400);
          echo json_encode(["error" => $e->getMessage()]);
          return false;
      }
  }
}
?>