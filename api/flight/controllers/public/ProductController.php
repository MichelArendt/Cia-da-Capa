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

      Flight::json($products, 200);
    } catch (Exception $e) {
      $message = "Error in ProductController::getAll(): " . $e->getMessage();
      error_log($message);
      Flight::json(["message" => $message], 500);
    }
  }

  public function getById($id){
    try {
      $productModel = Flight::get('productModel');
      $product = $productModel->getById($id);

      if($product === null) {
            Flight::json(["error" => "Product with ID $id not found"], 404);
            return;
      }

      Flight::json($product, 200);
    } catch (Exception $e) {
      $message = "Error in ProductController::getById(): " . $e->getMessage();
      error_log($message);
      Flight::json(["message" => $message], 500);
    }
  }
}