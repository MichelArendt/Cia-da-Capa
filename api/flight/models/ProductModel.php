<?php

namespace Models;

use PDO;
use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductModel
{
    private $db;

    public function __construct()
    {
        $this->db = Flight::get('db');
    }

    // Check if the table exists and create it if necessary
    public function createTableIfNotExists()
    {
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
    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM products");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []; // Ensure an empty array if no results
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductModel->getAll()");
        }
    }

    // Fetch by ID
    public function getForId($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM products WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null; // Ensure null if no results
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductModel->getForId()");
        }
    }

    // Create a new product
    public function create(string $title, string $reference, ?string $description, int $category_id, bool $is_active, bool $is_highlighted, int $priority): ?int
    {
        try {
            // Validate category existence
            $stmt = $this->db->prepare("SELECT id FROM product_categories WHERE id = ?");
            $stmt->execute([$category_id]);
            if (!$stmt->fetch()) {
                throw new Exception("Product category not found.");
            }

            // Insert product
            $stmt = $this->db->prepare("INSERT INTO products (title, reference, description, category_id, is_active, is_highlighted, priority)
                                      VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $reference, $description, $category_id, (int)$is_active, (int)$is_highlighted, $priority]);

            return $this->db->lastInsertId(); // Return new product ID
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductModel->create()");
        }
    }

    public function update($id, $title, $reference, $description, $category_id, $is_active, $is_highlighted, $priority)
    {
        try {
            $query = "UPDATE products
                  SET title = :title,
                      reference = :reference,
                      description = :description,
                      category_id = :category_id,
                      is_active = :is_active,
                      is_highlighted = :is_highlighted,
                      priority = :priority,
                      updated_at = CURRENT_TIMESTAMP
                  WHERE id = :id";

            $stmt = $this->db->prepare($query);

            return $stmt->execute([
                ':id' => $id,
                ':title' => $title,
                ':reference' => $reference,
                ':description' => $description,
                ':category_id' => $category_id,
                ':is_active' => $is_active,
                ':is_highlighted' => $is_highlighted,
                ':priority' => $priority
            ]);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductModel->update()");
        }
    }
}
