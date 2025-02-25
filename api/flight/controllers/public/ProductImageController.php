<?php
namespace Controllers\Public;

use Models\ProductImageModel;
use Exception;
use Flight;
use Helpers\HttpResponse;

class ProductImageController {
    private $db;
    private $imageModel;

    public function __construct($db) {
        $this->db = Flight::get('db');
        $this->imageModel = Flight::get('productImageModel');
    }

    /**
     * Fetch all images associated with a given product ID.
     */
    public function getImagesForProductId($product_id)
    {
        try {
            $images = $this->imageModel->getForProductId($product_id);

            HttpResponse::responseFetchSuccess($images);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageController->getImagesForProductId()");
        }
    }

    /**
     * Fetch all images associated with a given varaint ID.
     */
    public function getImagesForVariantId($variant_id)
    {
        try {
            $images = $this->imageModel->getForVariantId($variant_id);

            HttpResponse::responseFetchSuccess($images);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__);
        }
    }
}
