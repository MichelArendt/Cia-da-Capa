<?php

namespace Controllers\Manage;

use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductController
{
    public function create()
    {
        try {
            // Get product model instance from Flight container
            $productModel = Flight::get('productModel');

            // Decode incoming JSON request
            $data = json_decode(file_get_contents("php://input"), true);

            // Validate required fields
            if (empty($data['title']) || empty($data['reference']) || empty($data['category_id'])) {
                HttpResponse::returnValidationError("Título, Referência e Categoria são obrigatórios.");
            }

            // Extract data and apply defaults
            $title = trim($data['title']);
            $reference = trim($data['reference']);
            $description = isset($data['description']) ? trim($data['description']) : null;
            $category_id = (int) $data['category_id'];
            $is_active = isset($data['is_active']) ? (bool) $data['is_active'] : true;
            $is_highlighted = isset($data['is_highlighted']) ? (bool) $data['is_highlighted'] : false;
            $priority = isset($data['priority']) ? (int) $data['priority'] : 0;

            // Call model to insert product
            $newProductId = $productModel->create($title, $reference, $description, $category_id, $is_active, $is_highlighted, $priority);

            // Check if insertion was successful
            if ($newProductId === null) {
                throw new Exception("Falha ao criar o produto.");
            }

            // Respond with success
            HttpResponse::responseCreateSuccess("Produto criado com sucesso.", $newProductId);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductController->create()");
        }
    }

    public function update($id)
    {
        try {
            $id = (int) $id;

            // Get product model instance from Flight container
            $productModel = Flight::get('productModel');

            // Decode incoming JSON request
            $data = json_decode(file_get_contents("php://input"), true);

            // Validate required fields
            if (empty($data['title']) || empty($data['reference']) || empty($data['category_id'])) {
                HttpResponse::returnValidationError("Título, Referência e Categoria são obrigatórios.");
            }


            // Extract data and apply defaults
            $title = trim($data['title']);
            $reference = trim($data['reference']);
            $description = isset($data['description']) ? trim($data['description']) : null;
            $category_id = (int) $data['category_id'];
            $is_active = isset($data['is_active']) ? (int) $data['is_active'] : true;
            $is_highlighted = isset($data['is_highlighted']) ? (int) $data['is_highlighted'] : false;
            $priority = isset($data['priority']) ? (int) $data['priority'] : 0;

            // Verify if the product exists
            $existingProduct = $productModel->getForId($id);
            if (!$existingProduct) {
                HttpResponse::returnValidationError("Produto não encontrado.");
            }

            // Call model to update product
            $updateSuccess = $productModel->update(
                $id,
                $title,
                $reference,
                $description,
                $category_id,
                $is_active,
                $is_highlighted,
                $priority
            );

            // Check if update was successful
            if (!$updateSuccess) {
                throw new Exception("Falha ao atualizar o produto.");
            }

            // Respond with success
            HttpResponse::responseUpdateSuccess("Produto atualizado com sucesso.", $id);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductController->update()");
        }
    }
}
