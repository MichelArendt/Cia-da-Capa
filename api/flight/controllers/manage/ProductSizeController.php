<?php

namespace Controllers\Manage;

use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductSizeController
{
    private $productSizeModel;

    public function __construct()
    {
        $this->productSizeModel = Flight::get('productSizeModel');
    }

    public function create()
    {
        try {
            // Decode JSON request
            $data = json_decode(file_get_contents("php://input"), true);

            // Validate required fields
            if (
                empty($data['product_id']) ||
                empty($data['size_label_id']) ||
                !isset($data['width']) ||
                !isset($data['height']) ||
                !isset($data['depth'])
            ) {
                HttpResponse::returnValidationError(
                    "Todos os campos obrigatórios devem ser preenchidos!"
                );
            }

            // Call the model to insert data
            $newProductSizeId = $this->productSizeModel->create(
                (int) $data['product_id'],
                (int) $data['size_label_id'],
                (float) $data['width'],
                (float) $data['height'],
                (float) $data['depth']
            );

            // Check if insertion was successful
            if ($newProductSizeId === null) {
                HttpResponse::triggerError(
                    "Falha ao criar tamanho do produto.",
                    __METHOD__,
                    "ProductSizeController->create()"
                );
            }

            HttpResponse::responseCreateSuccess(
                "Tamanho de produto criado com sucesso!",
                (int)$newProductSizeId
            );
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeController->create()");
        }
    }

    public function update($id)
    {
        error_log("Updating product size with ID: $id");
        try {
            $id = (int) $id;

            // Decode JSON input
            $data = json_decode(file_get_contents("php://input"), true);

            // Validate required fields
            if (
                empty($data['size_label_id']) ||
                !isset($data['width']) ||
                !isset($data['height']) ||
                !isset($data['depth'])
            ) {
                HttpResponse::returnValidationError(
                    "Todos os campos obrigatórios devem ser preenchidos!"
                );
            }

            // Perform update
            $success = $this->productSizeModel->update(
                $id,
                (int) $data['size_label_id'],
                (float) $data['width'],
                (float) $data['height'],
                (float) $data['depth']
            );

            if (!$success) {
                throw new \Exception("Falha ao atualizar o tamanho de produto.");
            }

            HttpResponse::responseUpdateSuccess("Tamanho de produto atualizado com sucesso.", $id);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeController->update()");
        }
    }

    public function delete($id)
    {
        try {
            $id = (int) $id;

            $success = $this->productSizeModel->delete($id);

            if (!$success) {
                throw new \Exception("Falha ao deletar o tamanho de produto.");
            }

            HttpResponse::responseDeleteSuccess("Tamanho de produto removido com sucesso.");
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeController->delete()");
        }
    }
}
