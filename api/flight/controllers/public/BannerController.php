<?php

namespace Controllers\Public;

use Exception;
use Flight;
use Helpers\HttpResponse;

class BannerController
{
    private $model;

    public function __construct()
    {
        $this->model = Flight::get('bannerModel');
    }

    public function getAll()
    {
        $banners = $this->model->getAll();
        HttpResponse::responseFetchSuccess($banners);
    }

    public function getById($id)
    {
        try {
            $banner = $this->model->getById($id);

            if ($banner === null) {
                HttpResponse::returnValidationError("Banner não encontrado.");
            }

            HttpResponse::responseFetchSuccess($banner);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "BannerController->getForId()");
        }
    }
}
