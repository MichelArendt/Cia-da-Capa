<?php

namespace Controllers\Manage;

use PDOException;
use Flight;
use Exception;
use Helpers\HttpResponse;
use Helpers\ValidationHelper;

class ProductVariantController
{
    public function create()
    {
        try {
            $productVariantModel = Flight::get('productVariantModel');

            // Decode JSON payload
            $data = json_decode(file_get_contents("php://input"), true);

            $requiredFields = [
                'product_id' => 'ID do Produto',
                'reference' => 'Referência',
                'title' => 'Título',
                'description' => 'Descrição'
            ];

            $errorMessage = ValidationHelper::checkRequiredFields($data, $requiredFields);

            if ($errorMessage) {
                HttpResponse::returnValidationError($errorMessage);
            }

            // Create product category via the model
            $newVariantId = $productVariantModel->create(
                $data['product_id'],
                $data['reference'],
                $data['title'],
                $data['description'],
            );

            // Check if insertion was successful
            if ($newVariantId === null) {
                throw new Exception("Falha ao criar variante de produto.");
            }

            HttpResponse::responseCreateSuccess("Variante do produto criado com sucesso!", $newVariantId);
        } catch (PDOException $e) {
            // Handle MySQL constraint violations
            if ($e->getCode() == 23000) { // MySQL Integrity Constraint Violation
                if (str_contains($e->getMessage(), 'product_variants.product_id')) {
                    HttpResponse::returnValidationError("O produto especificado não existe.");
                }
                if (str_contains($e->getMessage(), 'product_variants.product_id_reference')) {
                    HttpResponse::returnValidationError("Já existe uma variante com esse nome para este produto.", 409);
                }
            }

            HttpResponse::handleException($e, __METHOD__, "ProductVariantController->create()");
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductVariantController->create()");
        }
    }

    public function update($id)
    {
        try {
            $productVariantModel = Flight::get('productVariantModel');

            // Decode JSON payload
            $data = json_decode(file_get_contents("php://input"), true);

            $requiredFields = [
                'reference' => 'Referência',
                'title' => 'Título',
                'description' => 'Descrição'
            ];

            $errorMessage = ValidationHelper::checkRequiredFields($data, $requiredFields);

            if ($errorMessage) {
                HttpResponse::returnValidationError($errorMessage);
            }

            // Attempt to update the product variant
            $updated = $productVariantModel->update(
                $id,
                $data['reference'],
                $data['title'],
                $data['description']
            );

            if (!$updated) {
                throw new Exception("Falha ao atualizar variante de produto.");
            }

            HttpResponse::responseUpdateSuccess("Variante do produto atualizada com sucesso!");
        } catch (PDOException $e) {
            // Handle MySQL constraint violations
            if ($e->getCode() == 23000) { // MySQL Integrity Constraint Violation
                // if (str_contains($e->getMessage(), 'product_variants.product_id')) {
                //     HttpResponse::returnValidationError("O produto especificado não existe.");
                // }
                if (str_contains($e->getMessage(), 'product_variants.product_id_reference')) {
                    HttpResponse::returnValidationError("Já existe uma variante com esse nome para este produto.", 409);
                }
            }

            HttpResponse::handleException($e, __METHOD__, "ProductVariantController->update()");
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductVariantController->update()");
        }
    }

    public function delete($id)
    {
        try {
            $productVariantModel = Flight::get('productVariantModel');

            // Ensure the ID is a valid integer
            if (!is_numeric($id) || $id <= 0) {
                HttpResponse::returnValidationError("ID inválido para exclusão.");
            }

            // Attempt to delete the variant
            $deleted = $productVariantModel->delete((int) $id);

            if (!$deleted) {
                throw new Exception("Falha ao excluir a variante do produto.");
            }

            HttpResponse::responseDeleteSuccess("Variante do produto excluída com sucesso!");
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductVariantController->delete()");
        }
    }
}
