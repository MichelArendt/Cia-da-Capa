<?php

namespace Controllers\Manage;

use Flight;
use PDO;
use Exception;

class ProductCategoryController {
  public function create() {
      try {
          $productCategoryModel = Flight::get('productCategoryModel');

          // Decode JSON payload
          $data = json_decode(file_get_contents("php://input"), true);

          // Validate required fields
          if (empty($data['name']) || empty($data['reference'])) {
              throw new Exception("Name and reference are required.");
          }

          // Create product category via the model
          $newCategoryId = $productCategoryModel->create(
              $data['name'],
              $data['reference'],
              $data['is_active'] ?? true
          );

          // Check if insertion was successful
          if ($newCategoryId === null) {
              throw new Exception("Failed to create product category.");
          }

          http_response_code(201);
          echo json_encode([
              "message" => "Product category created successfully.",
              "id" => $newCategoryId
          ]);
      } catch (Exception $e) {
          error_log("Error in ProductCategoryController::create(): " . $e->getMessage());
          http_response_code(400);
          echo json_encode(["error" => $e->getMessage()]);
      }
  }
}