<?php
namespace Models;

use PDO;
use Exception;

class ProductModel {
  private $db;

  public function __construct(PDO $db) {
      $this->db = $db;
      $this->createTableIfNotExists();
  }

  // Check if the table exists and create it if necessary
  private function createTableIfNotExists() {
      $query = "CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        reference VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INT NOT NULL,
        is_active TINYINT(1) DEFAULT 1,
        is_highlighted TINYINT(1) DEFAULT 0,
        priority INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE,
        UNIQUE KEY (reference, category_id)
      )";

      $this->db->exec($query);
  }

  // Fetch all products
  public function getAll(): array {
      try {
          $stmt = $this->db->prepare("SELECT * FROM products");
          $stmt->execute();
          return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []; // Ensure an empty array if no results
      } catch (Exception $e) {
          error_log("Database Error in ProductModel->getAll(): " . $e->getMessage());
          return null;
      }
  }

  // Fetch by ID
  public function getById($id) {
      try {
          $stmt = $this->db->prepare("SELECT * FROM products WHERE id = ?");
          $stmt->execute([$id]);
          return $stmt->fetch(PDO::FETCH_ASSOC) ?: null; // Ensure null if no results
      } catch (Exception $e) {
          error_log("Database Error in ProductModel->getById(): " . $e->getMessage());
          return null;
      }
  }

  // Create a new product
  public function create(string $title, string $reference, ?string $description, int $categoryId, bool $isActive, bool $isHighlighted, int $priority): ?int {
      try {
          // Validate category existence
          $stmt = $this->db->prepare("SELECT id FROM product_categories WHERE id = ?");
          $stmt->execute([$categoryId]);
          if (!$stmt->fetch()) {
              throw new Exception("Categoria não encontrada.");
          }

          // Insert product
          $stmt = $this->db->prepare("INSERT INTO products (title, reference, description, category_id, is_active, is_highlighted, priority)
                                      VALUES (?, ?, ?, ?, ?, ?, ?)");
          $stmt->execute([$title, $reference, $description, $categoryId, (int)$isActive, (int)$isHighlighted, $priority]);

          return $this->db->lastInsertId(); // Return new product ID
      } catch (Exception $e) {
          error_log("Erro ao criar produto: " . $e->getMessage());
          return null;
      }
  }
}
?>