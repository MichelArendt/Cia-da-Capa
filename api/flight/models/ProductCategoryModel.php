<?php

namespace Models;

use PDO;
use Exception;
use Helpers\ErrorHandler;

class ProductCategoryModel
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->createTableIfNotExists();
    }

    // Check if the table exists and create it if necessary
    private function createTableIfNotExists()
    {
        $query = "CREATE TABLE IF NOT EXISTS product_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      reference VARCHAR(255) UNIQUE NOT NULL,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";

        $this->db->exec($query);
    }

    // Fetch all product categories
    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM product_categories");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []; // Ensure an empty array if no results
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__, "ProductCategoryModel->getAll()");
        }
    }

    // create product category
    public function create(string $name, string $reference, bool $isActive = true): ?int
    {
        try {
            $stmt = $this->db->prepare(
                "
            INSERT INTO product_categories (name, reference, is_active, created_at, updated_at)
            VALUES (:name, :reference, :is_active, NOW(), NOW())"
            );

            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
            $stmt->bindParam(':reference', $reference, PDO::PARAM_STR);
            $stmt->bindParam(':is_active', $isActive, PDO::PARAM_BOOL);

            if (!$stmt->execute()) {
                throw new Exception("Failed to insert product category.");
            }

            return (int) $this->db->lastInsertId();
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__, "ProductCategoryModel->create()");
        }
    }

    // Delete product category by ID
    public function delete($id)
    {
        try {
            // Check if the category exists
            $stmt = $this->db->prepare("SELECT id FROM product_categories WHERE id = ?");
            $stmt->execute([$id]);

            if (!$stmt->fetch()) {
                throw new Exception("Category not found.");
            }

            // Check if there are any products associated with this category
            $stmt = $this->db->prepare("SELECT COUNT(*) as product_count FROM products WHERE category_id = ?");
            $stmt->execute([$id]);
            $productCount = $stmt->fetch(PDO::FETCH_ASSOC)['product_count'] ?? 0;

            if ($productCount > 0) {
                throw new Exception("Cannot delete category. There are $productCount products linked to this category.");
            }

            // Delete the category
            $stmt = $this->db->prepare("DELETE FROM product_categories WHERE id = ?");
            $stmt->execute([$id]);

            http_response_code(200);
            echo json_encode(["message" => "Category deleted successfully."]);
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__, "ProductCategoryModel->delete()");
        }
    }
}
