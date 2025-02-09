<?php
namespace Controllers\Public;

use Models\ProductImageModel;
use Exception;
use Flight;
use Helpers\ErrorHandler;

class ProductImageController {
    private $db;
    private $imageModel;

    public function __construct($db) {
        $this->db = $db;
        $this->imageModel = Flight::get('productImageModel');
    }

    /**
     * Fetch all images associated with a given product ID.
     */
    public function getImagesForProductId($product_id)
    {
        try {
            $images = $this->imageModel->getForProductId($product_id);
            Flight::json($images, 200);
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__);
        }
    }
}
