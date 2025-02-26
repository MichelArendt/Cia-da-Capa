<?php

namespace Controllers\Public;

use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductController
{
    public function getAll()
    {
        try {
            $productModel = Flight::get('productModel');
            $products = $productModel->getAll();

            if ($products === null) {
                throw new Exception("Failed to retrieve products.");
            }

            HttpResponse::responseFetchSuccess($products);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductController->getAll()");
        }
    }

    public function getForId($id)
    {
        try {
            $productModel = Flight::get('productModel');
            $product = $productModel->getForId($id);

            if ($product === null) {
                HttpResponse::returnValidationError("Produto não encontrado.");
            }

            Flight::json($product, 200);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductController->getForId()");
        }
    }

    public function getForIdFull($id)
    {
        try {
            // Fetch the basic product data
            $productModel = Flight::get('productModel');
            $product = $productModel->getForId($id);

            if ($product === null) {
                HttpResponse::returnValidationError("Produto não encontrado.");
            }

            // Fetch product images
            $productImageModel = Flight::get('productImageModel');
            $product['images'] = $productImageModel->getForProductId($id);

            // Fetch product sizes
            $productSizeModel = Flight::get('productSizeModel');
            $product['sizes'] = $productSizeModel->getSizesForProductId($id);

            // Fetch product variants
            $productVariantModel = Flight::get('productVariantModel');
            $product['variants'] = $productVariantModel->getVariantsForProductId($id);

            // Fetch product variants' images
            foreach ($product['variants'] as &$variant) { // Pass For reference to modify directly
                $variant['images'] = $productImageModel->getForVariantId($variant['id']);
            }

            HttpResponse::response(
                200,
                null,
                null,
                $product
            );
            // Flight::json($product, 200);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductController->getForIdFull()");
        }
    }
}
