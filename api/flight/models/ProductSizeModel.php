<?php

namespace Models;

use PDO;
use Exception;
use Flight;
use Helpers\HttpResponse;

class ProductSizeModel
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

    // Fetch all product sizes
    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM product_sizes");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeModel->getAll()");
        }
    }

    // Fetch by ID
    public function getSizesForProductId($product_id)
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM product_sizes WHERE product_id = ?");
            $stmt->execute([$product_id]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeModel->getSizesForProductId()");
        }
    }
}
