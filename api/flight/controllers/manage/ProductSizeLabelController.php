<?php

namespace Controllers\Manage;

use Error;
use Flight;
use Exception;
use Helpers\HttpResponse;

class ProductSizeLabelController
{
    private $productSizeLabelModel;

    public function __construct()
    {
        $this->productSizeLabelModel = Flight::get('productSizeLabelModel');
    }

    public function create()
    {
        try {
            // Decode JSON payload
            $data = json_decode(file_get_contents("php://input"), true);

            // Validate required fields
            if (empty($data['title']) || empty($data['label'])) {
                HttpResponse::returnValidationError(
                    "Título e rótulo são obrigatórios!"
                );
            }

            // Create product size label via the model
            $newProductSizeLabelId = $this->productSizeLabelModel->create(
                $data['title'],
                $data['label']
            );

            // Check if insertion was successful
            if ($newProductSizeLabelId === null) {
                HttpResponse::triggerError(
                    "Falha ao criar rótulo de tamanho de produto",
                    __METHOD__,
                    "ProductSizeLabelController->create()"
                );
            }

            HttpResponse::responseCreateSuccess(
                "Variante do produto criado com sucesso!",
                $newProductSizeLabelId
            );
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeLabelController->create()");
        }
    }

    public function update($id)
    {
        try {
            $id = (int)$id;

            // Decode incoming JSON request
            $data = json_decode(file_get_contents("php://input"), true);

            // Validate required fields
            if (empty($data['title']) || empty($data['label'])) {
                HttpResponse::returnValidationError("Título e rótulo são obrigatórios.");
            }

            // Extract and trim values
            $title = trim($data['title']);
            $label = trim($data['label']);

            // Check if the product size label exists
            // (Assumes a getForId method is implemented in the model, similar to the product model)
            $existingLabel = $this->productSizeLabelModel->getById($id);
            if (!$existingLabel) {
                HttpResponse::returnValidationError("Rótulo de tamanho do produto não encontrado.");
            }

            // Call the model update method
            $updateSuccess = $this->productSizeLabelModel->update($id, $title, $label);

            // Check if update was successful
            if (!$updateSuccess) {
                throw new Exception("Falha ao atualizar o rótulo de tamanho do produto.");
            }

            // Respond with success message
            HttpResponse::responseUpdateSuccess("Rótulo de tamanho de produto atualizado com sucesso.", $id);
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeLabelController->update()");
        }
    }


    public function deleteForIdAndReorderPriorities($id)
    {
        try {
            $productSizeLabelModel = Flight::get('productSizeLabelModel');

            // Validate that the ID is a positive integer
            if (!filter_var($id, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]])) {
                throw new Exception("Invalid size label ID.");
            }

            // Call the model function to handle deletion logic
            $result = $productSizeLabelModel->deleteForIdAndReorderPriorities($id);

            // If the model method returns false, assume failure
            if (!$result) {
                throw new Exception("Failed to delete product size label.");
            }

            // Return success response
            HttpResponse::responseDeleteSuccess("Rótulo de produto removido com sucesso!");
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeLabelController->deleteForIdAndReorderPriorities()");
        }
    }

    /**
     * Update the ordering (priority) of multiple items.
     *
     * Expects a JSON payload like:
     * [
     *     {"id":54,"priority":1},
     *     {"id":50,"priority":2},
     *     {"id":51,"priority":3},
     *     {"id":52,"priority":4},
     *     {"id":49,"priority":5},
     *     {"id":53,"priority":6}
     * ]
     */
    public function updateOrdering()
    {
        error_log(1);
        try {
            // Decode incoming JSON request
            $data = json_decode(file_get_contents("php://input"), true);

            // Detect if the data is double-encoded as a string
            if (is_string($data)) {
                $data = json_decode($data, true);
            }

            // Validate that we received a non-empty array of items
            if (!is_array($data) || empty($data)) {
                HttpResponse::triggerError(
                    "Nenhuma informação foi enviada.",
                    __METHOD__,
                    "ProductSizeLabelController->updateOrdering"
                );
                return;
            }

            // Validate that each item has both 'id' and 'priority'
            foreach ($data as $item) {
                if (!isset($item['id']) || !isset($item['priority'])) {
                    HttpResponse::triggerError(
                        "Campos necessários estão faltando.",
                        __METHOD__,
                        "ProductSizeLabelController->updateOrdering 2"
                    );
                }
            }

            // Call the model method to update ordering
            $result = $this->productSizeLabelModel->updateOrdering($data);

            if (!$result) {
                HttpResponse::triggerError(
                    "Erro ao tentar atualizar a ordem das imagens.",
                    __METHOD__,
                    "ProductSizeLabelController->updateOrdering 3"
                );
            }
            HttpResponse::responseUpdateSuccess("Ordem dos rótulos foi atualizada com sucesso!");
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ProductSizeLabelController->updateOrdering");
        }
    }
}
