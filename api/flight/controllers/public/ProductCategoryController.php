<?php

namespace Controllers\Public;

use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductCategoryController
{
    public function getAll()
    {
        try {
            $productCategoryModel = Flight::get('productCategoryModel');
            $productCategories = $productCategoryModel->getAll();

            if ($productCategories === null) {
                throw new Exception("Falha ao carregar as categorias dos produtos.");
            }

            HttpResponse::responseFetchSuccess($productCategories);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductCategoryController->getAll()");
        }
    }
}
