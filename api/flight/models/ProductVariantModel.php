<?php

namespace Models;

use PDO;
use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductVariantModel
{
    private $db;

    public function __construct()
    {
        $this->db = Flight::get('db');
    }

    // Check if the table exists and create it if necessary
    public function createTableIfNotExists()
    {
        $query = "
          CREATE TABLE IF NOT EXISTS product_variants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            reference VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            UNIQUE (product_id, reference)
          )";

        $this->db->exec($query);
    }

    // Create product variant
    public function create(int $product_id, string $reference, string $title, string $description): ?int
    {
        try {
            $stmt = $this->db->prepare(
                "
                INSERT INTO product_variants (product_id, reference, title, description, created_at, updated_at)
                VALUES (:product_id, :reference, :title, :description, NOW(), NOW())"
            );

            $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
            $stmt->bindParam(':reference', $reference, PDO::PARAM_STR);
            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                throw new Exception("Failed to insert product variant.");
            }

            return (int) $this->db->lastInsertId();
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductVariantModel->create()");
        }
    }

    // Fetch all products
    public function getVariantsForProductId($id): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM product_variants WHERE product_id = :product_id");
            $stmt->execute([':product_id' => $id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductVariantModel->getVariantsForProductWithId()");
        }
    }

    public function update(int $id, string $reference, string $title, string $description): bool
    {
        try {
            $stmt = $this->db->prepare(
                "
            UPDATE product_variants
            SET reference = :reference,
                title = :title,
                description = :description,
                updated_at = NOW()
            WHERE id = :id"
            );

            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':reference', $reference, PDO::PARAM_STR);
            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);

            $stmt->execute();

            if ($stmt->rowCount() === 0) {
                throw new Exception("Nenhuma variante foi atualizada. O ID fornecido pode não existir.");
            }

            return true;
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductVariantModel->update()");
        }
    }

    public function delete(int $id)
    {
        try {
            $this->db->beginTransaction();

            // Fetch associated images before deletion
            $productImageModel = Flight::get('productImageModel');
            $images = $productImageModel->getForVariantId($id);

            // Delete images from the database and filesystem
            foreach ($images as $image) {
                $productImageModel->deleteForIdAndReorderPriorities($image['id']);
            }

            // Delete the product variant
            $stmt = $this->db->prepare("DELETE FROM product_variants WHERE id = :id");
            $stmt->execute([':id' => $id]);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            HttpResponse::handleException($e, __METHOD__, "ProductVariantModel->delete()");
        }
    }
}
