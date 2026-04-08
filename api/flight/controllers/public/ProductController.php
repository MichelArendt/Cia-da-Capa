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

            // --- 1. Parse query parameters (all optional) ---
            $categoryId         = isset($_GET['category_id'])           ? (int)$_GET['category_id']         : null;
            $excludeId          = isset($_GET['exclude_id'])            ? (int)$_GET['exclude_id']          : null;
            $highlighted        = isset($_GET['highlighted'])           ? (int)$_GET['highlighted']         : null;
            $withImages         = isset($_GET['with_images'])           ? (bool)$_GET['with_images']        : true;
            $limit              = isset($_GET['limit'])                 ? (int)$_GET['limit']               : null;
            $perCategoryLimit   = isset($_GET['per_category_limit'])    ? (int)$_GET['per_category_limit']  : null;

            // --- 2. Build a filter array ---
            $filters = [
                'category_id'           => $categoryId,
                'exclude_id'            => $excludeId,
                'highlighted'           => $highlighted,
                'limit'                 => $limit,
                'per_category_limit'    => $perCategoryLimit,
            ];

            error_log(print_r($filters, true));

            // --- 3. Call the model method, passing filters ---
            $products = $productModel->getAllFiltered($filters);

            // --- 4. Optionally add images ---
            if ($withImages) {
                $productImageModel = Flight::get('productImageModel');
                foreach ($products as &$product) {
                    $product['images'] = $productImageModel->getForProductId($product['id']);
                }
            }

            HttpResponse::responseFetchSuccess($products);

            // HttpResponse::responseFetchSuccess($products);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductController->getAll()");
        }
    }


    /**
     * Fetch all products with only essential fields for short listing.
     */
    public function getAllShort()
    {
        try {
            $productModel = \Flight::get('productModel');
            $products = $productModel->getAllShort();
            \Helpers\HttpResponse::responseFetchSuccess($products);
        } catch (\Exception $e) {
            \Helpers\HttpResponse::handleException($e, __METHOD__, "ProductController->getAllShort()");
        }
    }

    public function getAllHighlighted()
    {
        try {
            $productModel = Flight::get('productModel');
            $products = $productModel->getAllHighlighted();

            if ($products === null) {
                throw new Exception("Falha ao recuperar os produtos destacados.");
            }

            HttpResponse::responseFetchSuccess($products);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductController->getAllHighlighted()");
        }
    }

    public function getAllHighlightedWithImages()
    {
        try {
            $productModel = Flight::get('productModel');
            $products = $productModel->getAllHighlightedWithImages();

            HttpResponse::responseFetchSuccess($products);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductController->getAllHighlighted()");
        }
    }

    public function getRandomWithImages()
    {
        try {
            $productModel = Flight::get('productModel');
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;

            // Default highlighted=1, allow override
            $highlighted = isset($_GET['highlighted'])
                ? ($_GET['highlighted'] === '0' || $_GET['highlighted'] === 'false' ? false : true)
                : true;

            $products = $productModel->getRandomWithImages($limit, $highlighted);

            HttpResponse::responseFetchSuccess($products);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductController->getRandomWithImages()");
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

            HttpResponse::responseFetchSuccess($product);
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

            HttpResponse::responseFetchSuccess($product);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductController->getForIdFull()");
        }
    }
}
