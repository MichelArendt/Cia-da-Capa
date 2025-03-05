<?php

namespace Models;

use PDO;
use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductCategoryModel
{
    private $db;

    public function __construct()
    {
        $this->db = Flight::get('db');
    }

    // Check if the table exists and create it if necessary
    public function createTableIfNotExists()
    {
        $query = "CREATE TABLE IF NOT EXISTS product_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) UNIQUE NOT NULL,
            reference VARCHAR(255) UNIQUE NOT NULL,
            is_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";

        $this->db->exec($query);
    }

    // Create product category
    public function create(string $title, string $reference, bool $isActive = true): ?int
    {
        try {
            $stmt = $this->db->prepare(
                "
            INSERT INTO product_categories (title, reference, is_active, created_at, updated_at)
            VALUES (:title, :reference, :is_active, NOW(), NOW())"
            );

            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':reference', $reference, PDO::PARAM_STR);
            $stmt->bindParam(':is_active', $isActive, PDO::PARAM_BOOL);

            if (!$stmt->execute()) {
                throw new Exception("Falha ao inserir categoria de produto.");
            }

            return (int) $this->db->lastInsertId();
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductCategoryModel->create()");
        }
    }

    // Fetch all product categories
    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM product_categories");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []; // Ensure an empty array if no results
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductCategoryModel->getAll()");
        }
    }

    public function getById($categoryId)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM product_categories WHERE id = :id");
            $stmt->execute([':id' => $categoryId]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductCategoryModel->getById()");
        }
    }

    public function update($id, string $title, string $reference, bool $isActive = true): bool
    {
        try {
            $id = (int)$id;
            $sql = "UPDATE product_categories
                SET title = :title,
                    reference = :reference,
                    is_active = :is_active,
                    updated_at = NOW()
                WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':reference', $reference, PDO::PARAM_STR);
            $stmt->bindParam(':is_active', $isActive, PDO::PARAM_BOOL);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if (!$stmt->execute()) {
                throw new Exception("Falha ao atualizar categoria de produto.");
            }

            return true;
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductCategoryModel->update()");
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
                throw new Exception("Categoria não encontrada.");
            }

            // Check if there are any products associated with this category
            $stmt = $this->db->prepare("SELECT COUNT(*) as product_count FROM products WHERE category_id = ?");
            $stmt->execute([$id]);
            $productCount = $stmt->fetch(PDO::FETCH_ASSOC)['product_count'] ?? 0;

            if ($productCount > 0) {
                throw new Exception("Não é possível deletar a categoria. Existem {$productCount} produtos vinculados a esta categoria.");
            }

            // Delete the category
            $stmt = $this->db->prepare("DELETE FROM product_categories WHERE id = ?");
            $stmt->execute([$id]);

            HttpResponse::responseDeleteSuccess("Categoria deletada com sucesso.");
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductCategoryModel->delete()");
        }
    }
}
