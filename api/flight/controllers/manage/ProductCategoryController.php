<?php

namespace Controllers\Manage;

use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductCategoryController
{
    public function create()
    {
        try {
            $productCategoryModel = Flight::get('productCategoryModel');

            // Decode JSON payload
            $data = json_decode(file_get_contents("php://input"), true);

            // Validate required fields
            if (empty($data['title']) || empty($data['reference'])) {
                HttpResponse::returnValidationError("Título e referência são obrigatórios.");
            }

            // Create product category via the model
            $newCategoryId = $productCategoryModel->create(
                $data['title'],
                $data['reference'],
                $data['is_active'] ?? true
            );

            // Check if insertion was successful
            if ($newCategoryId === null) {
                throw new Exception("Falha ao criar categoria de produto.");
            }

            HttpResponse::responseCreateSuccess(
                "Categoria de produto criada com sucesso.",
                $newCategoryId
            );
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductCategoryController->create()");
        }
    }

    public function update($id)
    {
        try {
            $id = (int)$id;
            $productCategoryModel = Flight::get('productCategoryModel');

            // Decode incoming JSON request
            $data = json_decode(file_get_contents("php://input"), true);

            // Validate required fields
            if (empty($data['title']) || empty($data['reference'])) {
                HttpResponse::returnValidationError("Título e referência são obrigatórios.");
            }

            // Extract and trim values
            $title = trim($data['title']);
            $reference = trim($data['reference']);
            $is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;

            // Check if the product category exists
            $existingCategory = $productCategoryModel->getById($id);
            if (!$existingCategory) {
                HttpResponse::returnValidationError("Categoria de produto não encontrada.");
            }

            // Call the model update method
            $updateSuccess = $productCategoryModel->update($id, $title, $reference, $is_active);

            // Check if update was successful
            if (!$updateSuccess) {
                throw new Exception("Falha ao atualizar a categoria de produto.");
            }

            // Respond with success message
            HttpResponse::responseUpdateSuccess("Categoria de produto atualizada com sucesso.", $id);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductCategoryController->update()");
        }
    }

    public function delete($id)
    {
        try {
            $productCategoryModel = Flight::get('productCategoryModel');

            // Validate that the ID is a positive integer
            if (!filter_var($id, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
                HttpResponse::returnValidationError("ID da categoria inválido.");
            }

            // Call the model function to handle deletion logic
            $result = $productCategoryModel->delete($id);

            // If the model method returns false, assume failure
            if (!$result) {
                throw new Exception("Falha ao deletar a categoria.")
            }

            // Return success response
            http_response_code(200);
            echo json_encode(["message" => "Category deleted successfully."]);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductCategoryController->delete()");
        }
    }
}
