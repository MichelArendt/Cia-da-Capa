<?php

namespace Controllers\Manage;

use PDOException;
use Flight;
use Exception;
use Helpers\ErrorHandler;

class ProductVariantController
{
    public function create()
    {
        try {
            $productVariantModel = Flight::get('productVariantModel');

            // Decode JSON payload
            $data = json_decode(file_get_contents("php://input"), true);

            // Validate required fields
            if (empty($data['product_id']) || empty($data['name']) || empty($data['title']) || empty($data['description'])) {
                ErrorHandler::returnValidationError("Você deve preencher todos os campos.");
            }

            // Create product category via the model
            $newVariantId = $productVariantModel->create(
                $data['product_id'],
                $data['name'],
                $data['title'],
                $data['description'],
            );

            // Check if insertion was successful
            if ($newVariantId === null) {
                throw new Exception("Falha ao criar variante de produto.");
            }

            Flight::json([
                "message" => "Variante do produto criado com sucesso!",
                "id" => $newVariantId
            ], 200);
        } catch (PDOException $e) {
            // Handle MySQL constraint violations
            if ($e->getCode() == 23000) { // MySQL Integrity Constraint Violation
                if (str_contains($e->getMessage(), 'product_variants.product_id')) {
                    ErrorHandler::returnValidationError("O produto especificado não existe.");
                }
                if (str_contains($e->getMessage(), 'product_variants.product_id_name')) {
                    ErrorHandler::returnValidationError("Já existe uma variante com esse nome para este produto.", 409);
                }
            }

            ErrorHandler::handleException($e, __METHOD__, "ProductVariantController->create()");
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__, "ProductVariantController->create()");
        }
    }
}
