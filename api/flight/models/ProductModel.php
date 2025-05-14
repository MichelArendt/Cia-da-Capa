<?php

namespace Models;

use PDO;
use Flight;
use Exception;
use Helpers\FileHelper;
use Helpers\HttpResponse;

class ProductModel
{
    private $db;
    private $table;
    private $table_product_categories;
    private $table_product_images;
    private $table_product_variants;

    public function __construct()
    {
        $this->db = Flight::get('db');
        $this->table = Flight::get('tables')['products'];
        $this->table_product_categories = Flight::get('tables')['product_categories'];
        $this->table_product_images = Flight::get('tables')['product_images'];
        $this->table_product_variants = Flight::get('tables')['product_variants'];
    }

    // Check if the table exists and create it if necessary
    public function createTableIfNotExists()
    {
        $query = "CREATE TABLE IF NOT EXISTS `{$this->table}` (
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
            FOREIGN KEY (category_id) REFERENCES `{$this->table_product_categories}`(id) ON DELETE CASCADE,
            UNIQUE KEY (reference, category_id)
      )";

        $this->db->exec($query);
    }

    // Fetch all products
    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM " . $this->table);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []; // Ensure an empty array if no results
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductModel->getAll()");
            return [];
        }
    }

    // Fetch all highlighted products
    public function getAllHighlighted(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM `{$this->table}` WHERE is_highlighted = 1");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []; // Always return an array
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductModel->getAllHighlighted()");
            return [];
        }
    }

    // Fetch by ID
    public function getForId($id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM `{$this->table}` WHERE id = ?");
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
            $stmt = $this->db->prepare("SELECT id FROM `{$this->table_product_categories}` WHERE id = ?");
            $stmt->execute([$category_id]);

            if (!$stmt->fetch()) {
                throw new Exception("Product category not found.");
            }

            // Insert product
            $stmt = $this->db->prepare("INSERT INTO `{$this->table}` (title, reference, description, category_id, is_active, is_highlighted, priority)
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
            $query = "UPDATE `{$this->table}`
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

    public function delete(int $id): bool
    {
        try {
            $this->db->beginTransaction();

            $stmt = $this->db->prepare("
            SELECT file_path FROM `{$this->table_product_images}`
            WHERE product_id = ? OR product_variant_id IN (
                SELECT id FROM `{$this->table_product_variants}` WHERE product_id = ?
            )");
            $stmt->execute([$id, $id]);
            $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $this->db->prepare("DELETE FROM `{$this->table}` WHERE id = ?");
            $stmt->execute([$id]);

            if (!empty($images)) {
                // Delete all unique image folders
                $foldersToDelete = [];
                foreach ($images as $image) {
                    $relativeFolder = dirname($image['file_path']);
                    $absoluteFolder = $_SERVER['DOCUMENT_ROOT'] . $relativeFolder;
                    if (is_dir($absoluteFolder)) {
                        $foldersToDelete[$absoluteFolder] = true;
                    }
                }

                foreach (array_keys($foldersToDelete) as $folderPath) {
                    if (!FileHelper::deleteFolderRecursive($folderPath)) {
                        throw new Exception("Failed to delete image folder: $folderPath");
                    }
                }
            }

            $this->db->commit();

            return true;
        } catch (Exception $e) {

            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }

            HttpResponse::handleException($e, __METHOD__, "ProductModel->delete()");
            return false;
        }
    }
}
