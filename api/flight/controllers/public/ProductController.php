<?php

namespace Controllers\Public;

use Flight;
use PDO;
use R;
use Exception;

class ProductController {
  public function getAll(){
    try {
      $productModel = Flight::get('productModel');
      $products = $productModel->getAll();

      if($products === null) {
        throw new Exception("Failed to retrieve products.");
      }

      http_response_code(200);
      echo json_encode($products);
    } catch (Exception $e) {
      error_log("Error in ProductController::getAll(): " . $e->getMessage());
      http_response_code(500);
      echo json_encode(["error" => "An internal server error occurred."]);
    }
  }
}