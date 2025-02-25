<?php

namespace Controllers\Public;

use PDOException;
use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductSizeController
{
    public function getSizesForProductId($id)
    {
        try {
            $productSizeModel = Flight::get('productSizeModel');
            $productSizes = $productSizeModel->getSizesForProductId($id);

            Flight::json($productSizes, 200);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__);
        }
    }
}