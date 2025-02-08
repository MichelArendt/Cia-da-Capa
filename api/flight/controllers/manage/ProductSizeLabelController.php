<?php

namespace Controllers\Manage;

use Flight;
use Exception;
use Helpers\ErrorHandler;

class ProductSizeLabelController {
  public function create() {
      try {
          $productSizeLabelModel = Flight::get('productSizeLabelModel');

          // Decode JSON payload
          $data = json_decode(file_get_contents("php://input"), true);

          // Validate required fields
          if (empty($data['name']) || empty($data['label'])) {
            Flight::json(["error" => "Name and label are required."], 400);
            return;
          }

          // Create product size label via the model
          $newProductSizeLabelId = $productSizeLabelModel->create(
              $data['name'],
              $data['label']
          );

          // Check if insertion was successful
          if ($newProductSizeLabelId === null) {
            Flight::json(["error" => "Failed to create product size label."], 500);
            return;
          }

          Flight::json(["message" => "Product size label created successfully."], 201);
      } catch (Exception $e) {
          error_log("Error in ProductSizeLabelController::create(): " . $e->getMessage());
          Flight::json(["error" => $e->getMessage()], 400);
      }
  }

  public function delete($id) {
        try {
            $productSizeLabelModel = Flight::get('productSizeLabelModel');

            // Validate that the ID is a positive integer
            if (!filter_var($id, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
                throw new Exception("Invalid size label ID.");
            }

            // Call the model function to handle deletion logic
            $result = $productSizeLabelModel->delete($id);

            // If the model method returns false, assume failure
            if (!$result) {
                throw new Exception("Failed to delete product size label.");
            }

            // Return success response
            Flight::json(["message" => "Product size label deleted ssucessfully."], 200);
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__);
        }
    }
}