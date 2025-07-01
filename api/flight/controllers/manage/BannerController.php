<?php

namespace Controllers\Manage;

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

    /**
     * Create a new banner (with images).
     */
    public function create()
    {
        try {
            $title = $_POST['title'] ?? '';
            if (!$title) {
                HttpResponse::returnValidationError("O campo 'title' é obrigatório.");
            }

            // Validate product_id
            $productId = $_POST['product_id'] ?? null;
            if (!$productId || !is_numeric($productId)) {
                HttpResponse::returnValidationError("O campo 'product_id' é obrigatório e deve ser numérico.");
            }

            foreach (['mobile', 'tablet', 'desktop'] as $f) {
                if (!isset($_FILES[$f])) {
                    HttpResponse::returnValidationError("O arquivo '$f' é obrigatório.");
                }
            }

            $result = $this->model->createBanner($title, [
                (int)$productId,
                'mobile' => $_FILES['mobile'],
                'tablet' => $_FILES['tablet'],
                'desktop' => $_FILES['desktop'],
            ]);

            if ($result['success']) {
                HttpResponse::responseCreateSuccess("Banner criado com sucesso.", null);
            } else {
                HttpResponse::triggerError($result['error'] ?? "Erro ao inserir o banner.", __METHOD__, "BannerController->create");
            }
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "BannerController->create");
        }
    }

    /**
     * Update a specific image size of a banner.
     * Expects: PUT with $_FILES['file'], param $id, param $size (mobile|tablet|desktop)
     */
    public function updateImage($id, $size)
    {
        try {
            if (!isset($_FILES['file'])) {
                HttpResponse::returnValidationError("Arquivo não enviado.");
            }

            if (!in_array($size, ['mobile', 'tablet', 'desktop'])) {
                HttpResponse::returnValidationError("Tamanho inválido. Use 'mobile', 'tablet' ou 'desktop'.");
            }

            $result = $this->model->updateBannerImage($id, $size, $_FILES['file']);

            if ($result['success']) {
                HttpResponse::responseUpdateSuccess("Imagem '$size' atualizada com sucesso.");
            } else {
                HttpResponse::triggerError($result['error'] ?? "Erro ao atualizar a imagem.", __METHOD__, "BannerController->updateImage");
            }
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "BannerController->updateImage");
        }
    }

    /**
     * Delete a banner and its images.
     */
    public function delete($id)
    {
        try {
            if ($this->model->delete($id)) {
                HttpResponse::responseDeleteSuccess("Banner removido com sucesso.");
            } else {
                HttpResponse::triggerError("Erro ao excluir o banner.", __METHOD__, "BannerController->delete");
            }
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "BannerController->delete");
        }
    }

    /**
     * Update the ordering of banners.
     */
    public function updateOrdering()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            if (is_string($data)) {
                $data = json_decode($data, true);
            }
            if (!is_array($data) || empty($data)) {
                HttpResponse::returnValidationError("Dados de ordenação inválidos.");
            }
            foreach ($data as $item) {
                if (!isset($item['id'], $item['priority'])) {
                    HttpResponse::returnValidationError("Cada item deve conter 'id' e 'priority'.");
                }
            }
            if ($this->model->updateOrdering($data)) {
                HttpResponse::responseUpdateSuccess("Ordem dos banners atualizada com sucesso.");
            } else {
                HttpResponse::triggerError("Erro ao atualizar ordem dos banners.", __METHOD__, "BannerController->updateOrdering");
            }
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "BannerController->updateOrdering");
        }
    }
}
