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

    /**
     * Fetch all products with only essential fields for short listing.
     * @return array
     */
    public function getAllShort(): array
    {
        try {
            $fields = "id, title, reference, category_id, is_active, is_highlighted, priority";
            $sql = "SELECT $fields FROM `{$this->table}` ORDER BY reference ASC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(\PDO::FETCH_ASSOC) ?: [];
        } catch (\Exception $e) {
            \Helpers\HttpResponse::handleException($e, __METHOD__, "ProductModel->getAllShort()");
            return [];
        }
    }


    public function getAllFiltered(array $filters = []): array
    {
        try {
            $where = [];
            $params = [];

            // Filter by category_id
            if (!empty($filters['category_id'])) {
                $where[] = "category_id = :category_id";
                $params[':category_id'] = $filters['category_id'];
            }

            // Exclude a specific product ID
            if (!empty($filters['exclude_id'])) {
                $where[] = "id != :exclude_id";
                $params[':exclude_id'] = $filters['exclude_id'];
            }

            // Only highlighted products (if set)
            if (isset($filters['highlighted']) && $filters['highlighted'] !== null && $filters['highlighted'] !== '') {
                $where[] = "is_highlighted = :highlighted";
                $params[':highlighted'] = (int)$filters['highlighted'];
            }

            // Build the WHERE clause
            $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

            // If per-category limit is provided, return up to N products per category.
            if (!empty($filters['per_category_limit'])) {
                $sql = "
                SELECT *
                FROM (
                    SELECT
                        p.*,
                        ROW_NUMBER() OVER (
                            PARTITION BY p.category_id
                            ORDER BY p.priority ASC, p.id ASC
                        ) AS row_num
                    FROM `{$this->table}` p
                    $whereClause
                ) ranked_products
                WHERE row_num <= :per_category_limit
                ORDER BY category_id ASC, priority ASC, id ASC
            ";

                $stmt = $this->db->prepare($sql);

                foreach ($params as $k => $v) {
                    $stmt->bindValue($k, $v, \PDO::PARAM_INT);
                }

                $stmt->bindValue(':per_category_limit', (int)$filters['per_category_limit'], \PDO::PARAM_INT);
                $stmt->execute();

                return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
            }

            // Default query path: normal filtering, optional total LIMIT
            $sql = "SELECT * FROM `{$this->table}` $whereClause ORDER BY priority ASC";

            // Add LIMIT if provided
            if (!empty($filters['limit'])) {
                $sql .= " LIMIT :limit";
            }

            $stmt = $this->db->prepare($sql);

            // Bind existing params
            foreach ($params as $k => $v) {
                $stmt->bindValue($k, $v, \PDO::PARAM_INT);
            }

            // Bind limit safely (IMPORTANT: must be int)
            if (!empty($filters['limit'])) {
                $stmt->bindValue(':limit', (int)$filters['limit'], \PDO::PARAM_INT);
            }

            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductModel->getAllFiltered()");
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

    public function getAllHighlightedWithImages(): array
    {
        try {
            $stmt = $this->db->prepare("
            SELECT p.*,
                   i.id AS image_id, i.file_path, i.thumbnail_file_path, i.medium_file_path, i.priority AS image_priority
            FROM {$this->table} p
            LEFT JOIN {$this->table_product_images} i ON p.id = i.product_id
            WHERE p.is_highlighted = 1
            ORDER BY p.priority ASC, i.priority ASC
        ");
            $stmt->execute();

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $products = [];

            foreach ($rows as $row) {
                $productId = $row['id'];

                if (!isset($products[$productId])) {
                    $products[$productId] = [
                        'id' => $row['id'],
                        'title' => $row['title'],
                        'reference' => $row['reference'],
                        'description' => $row['description'],
                        'category_id' => $row['category_id'],
                        'is_active' => $row['is_active'],
                        'is_highlighted' => $row['is_highlighted'],
                        'priority' => $row['priority'],
                        'created_at' => $row['created_at'],
                        'updated_at' => $row['updated_at'],
                        'images' => [],
                    ];
                }

                if (!empty($row['image_id'])) {
                    $products[$productId]['images'][] = [
                        'id' => $row['image_id'],
                        'file_path' => $row['file_path'],
                        'thumbnail_file_path' => $row['thumbnail_file_path'],
                        'medium_file_path' => $row['medium_file_path'],
                        'priority' => $row['image_priority'],
                    ];
                }
            }

            return array_values($products);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductModel->getAllHighlightedWithImages()");
            return [];
        }
    }

    /**
     * Get up to $limit random active products with their images.
     * Optionally filter for highlighted products.
     *
     * @param int $limit
     * @param bool|null $highlighted
     * @return array
     */ public function getRandomWithImages(int $limit = 5, ?bool $highlighted = true): array
    {
        try {
            // Always default to highlighted products
            $where = ["p.is_active = 1"];
            $params = [];

            if ($highlighted !== null) {
                $where[] = "p.is_highlighted = :highlighted";
                $params[':highlighted'] = $highlighted ? 1 : 0;
            }

            $whereClause = $where ? "WHERE " . implode(" AND ", $where) : "";
            $sql = "
            SELECT
                p.*,
                i.id AS image_id, i.file_path, i.thumbnail_file_path, i.medium_file_path, i.priority AS image_priority
            FROM `{$this->table}` p
            LEFT JOIN `{$this->table_product_images}` i ON p.id = i.product_id
            $whereClause
            ORDER BY RAND(), i.priority ASC
            LIMIT :limit
        ";

            $stmt = $this->db->prepare($sql);

            foreach ($params as $k => $v) {
                $stmt->bindValue($k, $v, \PDO::PARAM_INT);
            }
            $stmt->bindValue(':limit', $limit, \PDO::PARAM_INT);

            $stmt->execute();

            $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $products = [];
            foreach ($rows as $row) {
                $productId = $row['id'];
                if (!isset($products[$productId])) {
                    $products[$productId] = [
                        'id' => $row['id'],
                        'title' => $row['title'],
                        'reference' => $row['reference'],
                        'description' => $row['description'],
                        'category_id' => $row['category_id'],
                        'is_active' => $row['is_active'],
                        'is_highlighted' => $row['is_highlighted'],
                        'priority' => $row['priority'],
                        'created_at' => $row['created_at'],
                        'updated_at' => $row['updated_at'],
                        'images' => [],
                    ];
                }
                if (!empty($row['image_id'])) {
                    $products[$productId]['images'][] = [
                        'id' => $row['image_id'],
                        'file_path' => $row['file_path'],
                        'thumbnail_file_path' => $row['thumbnail_file_path'],
                        'medium_file_path' => $row['medium_file_path'],
                        'priority' => $row['image_priority'],
                    ];
                }
            }
            return array_values($products);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductModel->getRandomWithImages()");
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
