<?php

namespace Controllers\Public;

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

            HttpResponse::responseFetchSuccess($productSizes);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__);
        }
    }
}