<?php

namespace Controllers\Manage;

use Flight;
use Exception;

class ProductController {
  public function create() {
      try {
          // Get product model instance from Flight container
          $productModel = Flight::get('productModel');

          // Decode incoming JSON request
          $data = json_decode(file_get_contents("php://input"), true);

          // Validate required fields
          if (empty($data['title']) || empty($data['reference']) || empty($data['categoryId'])) {
            throw new Exception("Título, Referência e Categoria são obrigatórios.");
          }

          // Extract data and apply defaults
          $title = trim($data['title']);
          $reference = trim($data['reference']);
          $description = isset($data['description']) ? trim($data['description']) : null;
          $categoryId = (int) $data['categoryId'];
          $isActive = isset($data['isActive']) ? (bool) $data['isActive'] : true;
          $isHighlighted = isset($data['isHighlighted']) ? (bool) $data['isHighlighted'] : false;
          $priority = isset($data['priority']) ? (int) $data['priority'] : 0;

          // Call model to insert product
          $newProductId = $productModel->create($title, $reference, $description, $categoryId, $isActive, $isHighlighted, $priority);

          // Check if insertion was successful
          if ($newProductId === null) {
              throw new Exception("Falha ao criar o produto.");
          }

          // Respond with success
        Flight::json([
            "message" => "Produto criado com sucesso.",
            "id" => $newProductId], 201);
      } catch (Exception $e) {
          // Log and return error
          error_log("Error in ProductController->create(): " . $e->getMessage());
          Flight::json(["message" => "Error in ProductController::create(): " . $e->getMessage()], 500);
      }
  }
}