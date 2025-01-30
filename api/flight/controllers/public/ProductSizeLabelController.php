<?php

namespace Controllers\Public;

use Flight;
use PDO;
use R;
use Exception;

class ProductSizeLabelController {
  public function getAll(){
    try {
      $productSizeLabelModel = Flight::get('productSizeLabelModel');
      $productSizeLabels = $productSizeLabelModel->getAll();

      if($productSizeLabels === null) {
        throw new Exception("Failed to retrieve product size labels.");
      }

      http_response_code(200);
      echo json_encode($productSizeLabels);
    } catch (Exception $e) {
      error_log("Error in ProductSizeLabelController::getAll(): " . $e->getMessage());
      http_response_code(500);
      echo json_encode(["error" => "An internal server error occurred."]);
    }
  }
}