<?php

namespace Controllers\Public;

use Flight;
use Exception;
use Helpers\ErrorHandler;

class ProductVariantController {
  public function getVariantsForProductWithId($id){
    try {
      $productVariantModel = Flight::get('productVariantModel');
      $productVariants = $productVariantModel->getVariantsForProductWithId($id);

      if($productVariants === null) {
        throw new Exception("Failed to retrieve product categories.");
      }

      Flight::json($productVariants, 200);
    } catch (Exception $e) {
      ErrorHandler::handleException($e, __METHOD__);
    }
  }
}