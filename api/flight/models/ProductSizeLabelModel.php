<?php

namespace Models;

use PDO;
use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductSizeLabelModel
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
          CREATE TABLE IF NOT EXISTS product_size_labels (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            label VARCHAR(50) UNIQUE NOT NULL,
            priority INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )";

        $this->db->exec($query);

        // Check if the trigger already exists by querying INFORMATION_SCHEMA.
        // Then create it only if not found.
        try {
            $checkTrigger = $this->db->prepare("
                SELECT TRIGGER_NAME
                FROM INFORMATION_SCHEMA.TRIGGERS
                WHERE TRIGGER_SCHEMA = DATABASE()
                  AND TRIGGER_NAME = 'before_insert_product_size_labels'
            ");
            $checkTrigger->execute();
            $exists = $checkTrigger->fetch();

            if (!$exists) {
                // Create BEFORE INSERT Trigger (Auto-Increment Priority)
                $triggerQuery = "
                    CREATE TRIGGER before_insert_product_size_labels
                    BEFORE INSERT ON product_size_labels
                    FOR EACH ROW
                    BEGIN
                        DECLARE max_priority INT;

                        -- Get the next priority number
                        SELECT COALESCE(MAX(priority), 0) + 1 INTO max_priority
                        FROM product_size_labels;

                        -- Assign the next priority number
                        SET NEW.priority = max_priority;
                    END;
                ";

                $this->db->exec($triggerQuery);
            }
        } catch (\PDOException $e) {
            HttpResponse::handlePdoException($e, __METHOD__, "Trigger creation failed in ProductSizeLabelModel->createTableIfNotExists()");
        }
    }

    // Fetch all product size labels
    public function getAll(): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM product_size_labels");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: []; // Ensure an empty array if no results
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeLabelModel->getAll()");
        }
    }

    // create product size label
    public function create(string $title, string $label): ?int
    {
        try {
            $stmt = $this->db->prepare(
                "
            INSERT INTO product_size_labels (title, label, created_at, updated_at)
            VALUES (:title, :label, NOW(), NOW())"
            );

            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindParam(':label', $label, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                throw new Exception("Failed to insert product size label.");
            }

            return (int) $this->db->lastInsertId();
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeLabelModel->create()");
        }
    }

    // Delete product size label by ID
    public function deleteForIdAndReorderPriorities($id)
    {
        try {
            // Check if the size label exists and get its priority
            $stmt = $this->db->prepare("SELECT id, priority FROM product_size_labels WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                throw new Exception("Size label not found.");
            }

            $deletedPriority = (int)$row['priority'];

            // Check if there are any products associated with this size label
            $stmt = $this->db->prepare("SELECT COUNT(*) as product_count FROM product_sizes WHERE size_label_id = ?");
            $stmt->execute([$id]);
            $productCount = (int)($stmt->fetch(PDO::FETCH_ASSOC)['product_count'] ?? 0);

            if ($productCount > 0) {
                throw new Exception("Cannot delete size label. There are $productCount products linked to this size label.");
            }

            // Delete the size label
            $stmt = $this->db->prepare("DELETE FROM product_size_labels WHERE id = ?");
            $stmt->execute([$id]);

            // Reorder priorities: decrement by one for all size labels with a higher priority than the deleted one
            $stmt = $this->db->prepare("UPDATE product_size_labels SET priority = priority - 1 WHERE priority > ?");
            return $stmt->execute([$deletedPriority]);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeLabelModel->delete()");
        }
    }

    public function updateOrdering(array $orderData)
    {
        try {
            if (empty($orderData)) {
                throw new Exception("No ordering data provided");
            }

            $ids = [];
            $caseSql = "";

            // Build the CASE expression and collect the IDs.
            foreach ($orderData as $item) {
                if (!isset($item['id']) || !isset($item['priority'])) {
                    throw new Exception("Missing id or priority in one or more items");
                }
                $id = (int)$item['id'];
                $priority = (int)$item['priority'];
                $ids[] = $id;
                $caseSql .= " WHEN {$id} THEN {$priority} ";
            }

            // Create a comma-separated list of IDs for the WHERE clause.
            $idsList = implode(', ', $ids);

            // Build the final SQL statement.
            $sql = "UPDATE product_size_labels SET priority = CASE id {$caseSql} END WHERE id IN ({$idsList})";

            // Prepare and execute the SQL statement.
            $stmt = $this->db->prepare($sql);
            return $stmt->execute();
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeLabelModel->updateOrdering()");
        }
    }
}
