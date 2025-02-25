<?php

namespace Controllers\Public;

use Flight;
use Exception;
use Helpers\HttpResponse;


class ProductSizeLabelController {
  public function getAll(){
    try {
      $productSizeLabelModel = Flight::get('productSizeLabelModel');
      $productSizeLabels = $productSizeLabelModel->getAll();

      if($productSizeLabels === null) {
        throw new Exception("Falha ao carregar os rótulos de tamanho dos produtos.");
      }

      HttpResponse::responseFetchSuccess($productSizeLabels);
    } catch (Exception $e) {
      HttpResponse::handleException($e, __METHOD__, "ProductSizeLabelController->getAll()");
    }
  }
}