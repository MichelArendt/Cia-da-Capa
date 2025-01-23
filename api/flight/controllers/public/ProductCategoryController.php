<?php

namespace Controllers\Public;

use Flight;
use PDO;
use R;
use Exception;

class ProductCategoryController {
  public function getAll(){
    try {
      $productCategoryModel = Flight::get('productCategoryModel');
      $productCategories = $productCategoryModel->getAll();

      if($productCategories === null) {
        throw new Exception("Failed to retrieve product categories.");
      }

      http_response_code(200);
      echo json_encode($productCategories);
    } catch (Exception $e) {
      error_log("Error in ProductCategoryController::getAll(): " . $e->getMessage());
      http_response_code(500);
      echo json_encode(["error" => "An internal server error occurred."]);
    }
  }
}