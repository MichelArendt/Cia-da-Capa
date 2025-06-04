<?php

namespace Controllers\Manage;

use Exception;
use Flight;
use Helpers\HttpResponse;

class ProductImageController
{
    private $imageModel;

    public function __construct()
    {
        $this->imageModel = Flight::get('productImageModel');
    }

    /**
     * Upload images for a specific product (no variant).
     * Expects files in $_FILES['files'] (multiple or single), product_id param.
     */
    public function uploadImages($product_id)
    {
        try {
            if (!isset($_FILES['files'])) {
                HttpResponse::returnValidationError("Nenhum arquivo enviado!");
            }

            $result = $this->imageModel->addImagesToProduct($product_id, $_FILES['files']);

            if ($result['success']) {
                HttpResponse::response(200, "Upload realizado com sucesso.", null, $result['files']);
            } else {
                HttpResponse::returnValidationError($result['error'] ?? "Erro ao enviar imagens.");
            }
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageController->uploadImages()");
        }
    }

    /**
     * Upload images for a specific product variant.
     * Expects files in $_FILES['files'] (multiple or single), variantId param.
     */
    public function uploadVariantImages($variantId)
    {
        try {
            if (!isset($_FILES['files'])) {
                HttpResponse::returnValidationError("Nenhum arquivo enviado!");
            }

            $result = $this->imageModel->addImagesToVariant($variantId, $_FILES['files']);

            if ($result['success']) {
                HttpResponse::response(200, "Upload realizado com sucesso.", null, $result['files']);
            } else {
                HttpResponse::returnValidationError($result['error'] ?? "Erro ao enviar imagens.");
            }
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageController->uploadVariantImages()");
        }
    }

    /**
     * Delete an image by ID, and reorder priorities.
     */
    public function deleteForIdAndReorderPriorities($image_id)
    {
        try {
            if ($this->imageModel->deleteForIdAndReorderPriorities($image_id)) {
                HttpResponse::responseDeleteSuccess("A imagem foi removida com sucesso!");
            } else {
                HttpResponse::triggerError("Erro ao remover imagem.", __METHOD__, "ProductImageController->deleteForIdAndReorderPriorities()");
            }
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageController->deleteForIdAndReorderPriorities()");
        }
    }

    /**
     * Update image ordering for a list of IDs/priorities.
     * Expects: [{"id": ..., "priority": ...}, ...]
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

            if ($this->imageModel->updateOrdering($data)) {
                HttpResponse::responseUpdateSuccess("Ordem das imagens foi atualizada com sucesso!");
            } else {
                HttpResponse::triggerError("Erro ao atualizar ordem das imagens.", __METHOD__, "ProductImageController->updateOrdering");
            }
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductImageController->updateOrdering");
        }
    }
}