<?php

namespace Controllers\Manage;

use Flight;
use PDO;
use Exception;

class ProductController {
  public function create() {
      try {
          // Get product model instance from Flight container
          $productModel = Flight::get('productModel');

          // Decode incoming JSON request
          $data = json_decode(file_get_contents("php://input"), true);

          // Validate required fields
          if (empty($data['title']) || empty($data['reference']) || empty($data['category_id'])) {
              throw new Exception("Título, Referência e Categoria são obrigatórios.");
          }

          // Extract data and apply defaults
          $title = trim($data['title']);
          $reference = trim($data['reference']);
          $description = isset($data['description']) ? trim($data['description']) : null;
          $categoryId = (int) $data['category_id'];
          $isActive = isset($data['is_active']) ? (bool) $data['is_active'] : true;
          $isHighlighted = isset($data['is_highlighted']) ? (bool) $data['is_highlighted'] : false;
          $priority = isset($data['priority']) ? (int) $data['priority'] : 0;

          // Call model to insert product
          $newProductId = $productModel->create($title, $reference, $description, $categoryId, $isActive, $isHighlighted, $priority);

          // Check if insertion was successful
          if ($newProductId === null) {
              throw new Exception("Falha ao criar o produto.");
          }

          // Respond with success
          http_response_code(201);
          echo json_encode([
              "message" => "Produto criado com sucesso.",
              "id" => $newProductId
          ]);

      } catch (Exception $e) {
          // Log and return error
          error_log("Erro em ProductController->create(): " . $e->getMessage());
          http_response_code(400);
          echo json_encode(["error" => $e->getMessage()]);
      }
  }
}