<?php

namespace Models;

use PDO;
use Exception;
use Helpers\ErrorHandler;

class ProductModel
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
            ErrorHandler::handleException($e, __METHOD__, "ProductModel->getAll()");
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
            ErrorHandler::handleException($e, __METHOD__, "ProductModel->getForId()");
        }
    }

    // // Fetch by ID - full details (images, variants and sizes)
    // public function getForIdFull($id)
    // {
    //     try {
    //         // Fetch the basic product data
    //         $product = $this->getForId($id);

    //         if ($product == null) {
    //             ErrorHandler::returnValidationError("Produto não encontrado.");
    //         }

    //         // Fetch product images from the product_images table
    //         $stmtImages = $this->db->prepare("SELECT * FROM product_images WHERE product_id = ?");
    //         $stmtImages->execute([$id]);
    //         // Use a lower-case key ("images") so that your JSON matches the expected naming (snake_case -> PascalCase)
    //         $product['images'] = $stmtImages->fetchAll(PDO::FETCH_ASSOC);

    //         // Fetch product sizes from the product_sizes table
    //         $stmtSizes = $this->db->prepare("SELECT * FROM product_sizes WHERE product_id = ?");
    //         $stmtSizes->execute([$id]);
    //         $product['sizes'] = $stmtSizes->fetchAll(PDO::FETCH_ASSOC);

    //         // Fetch product variants from the product_variants table
    //         $stmtVariants = $this->db->prepare("SELECT * FROM product_variants WHERE product_id = ?");
    //         $stmtVariants->execute([$id]);
    //         $product['variants'] = $stmtVariants->fetchAll(PDO::FETCH_ASSOC);

    //         return $product;  // Returns an associative array with keys for product fields, and arrays for images, sizes, and variants.
    //     } catch (Exception $e) {
    //         ErrorHandler::handleException($e, __METHOD__, "ProductModel->getForId()");
    //     }
    // }

    // Create a new product
    public function create(string $title, string $reference, ?string $description, int $categoryId, bool $isActive, bool $isHighlighted, int $priority): ?int
    {
        try {
            // Validate category existence
            $stmt = $this->db->prepare("SELECT id FROM product_categories WHERE id = ?");
            $stmt->execute([$categoryId]);
            if (!$stmt->fetch()) {
                throw new Exception("Product category not found.");
            }

            // Insert product
            $stmt = $this->db->prepare("INSERT INTO products (title, reference, description, category_id, is_active, is_highlighted, priority)
                                      VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $reference, $description, $categoryId, (int)$isActive, (int)$isHighlighted, $priority]);

            return $this->db->lastInsertId(); // Return new product ID
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__, "ProductModel->create()");
        }
    }
}
