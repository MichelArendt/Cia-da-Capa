<?php

namespace Controllers\Public;

use Flight;
use Exception;
use Helpers\ErrorHandler;

class ProductVariantController {
  public function getVariantsForProductWithId($id){
    try {
      error_log("ProductVariantController->getVariantsForProductWithId 1");
      $productVariantModel = Flight::get('productVariantModel');
      $productVariants = $productVariantModel->getVariantsForProductWithId($id);
      error_log("ProductVariantController->getVariantsForProductWithId 2");

      if($productVariants === null) {
        error_log("ProductVariantController->getVariantsForProductWithId 22");
        throw new Exception("Failed to retrieve product categories.");
      }

      error_log("ProductVariantController->getVariantsForProductWithId 3");
      Flight::json($productVariants, 200);
    } catch (Exception $e) {
      error_log("ProductVariantController->getVariantsForProductWithId 4");
      ErrorHandler::handleException($e, __METHOD__);
    }
  }
}