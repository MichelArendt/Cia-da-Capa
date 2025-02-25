<?php

namespace Controllers\Public;

use PDOException;
use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductVariantController
{
    public function getVariantsForProductId($id)
    {
        try {
            $productVariantModel = Flight::get('productVariantModel');
            $productVariants = $productVariantModel->getVariantsForProductId($id);

            if ($productVariants === null) {
                throw new Exception("Failed to retrieve product categories.");
            }

            HttpResponse::responseFetchSuccess($productVariants);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__);
        }
    }
}
