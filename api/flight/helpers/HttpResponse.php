<?php

namespace Helpers;

use Flight;

class HttpResponse
{
    /**
     * Generates a Flight JSON response with the structure of HttpResponseModel.
     *
     * @param int $code HTTP Status Code
     * @param string $message Success or general message
     * @param string|null $errorMessage Detailed error message (if applicable)
     * @param mixed $data Response data (default is empty object `{}`)
     */
    public static function response(int $code = 200, string $message = null, string $errorMessage = null, $data = null)
    {
        Flight::json([
            "status_code" => $code,
            "message" => $message,
            "error_message" => $errorMessage,
            "data" => $data
            // "data" => empty($data) ? null : $data // Ensure empty data is `{}` instead of `[]`
        ], $code);
    }

    /**
     * Generates a success response for a create operation.
     *
     * @param string $message Success message
     * @param mixed $data Response data
     */
    public static function responseCreateSuccess($message, $data)
    {
        HttpResponse::response(201, $message, null, $data);
    }

    /**
     * Generates a success response for a delete operation.
     *
     * @param string $message Success message
     */
    public static function responseDeleteSuccess($message)
    {
        HttpResponse::response(200, $message, null, null);
    }

    /**
     * Generates a success response for an update operation.
     *
     * @param string $message Success message
     * @param mixed $data Response data (optional)
     */
    public static function responseUpdateSuccess($message, $data = null)
    {
        HttpResponse::response(200, $message, null, $data);
    }

    /**
     * Generates a success response for a fetch operation.
     *
     * @param mixed $data Response data
     */
    public static function responseFetchSuccess($data)
    {
        HttpResponse::response(200, null, null, $data);
    }

    /**
     * Generates a no content response.
     */
    public static function responseNoContent()
    {
        HttpResponse::response(204);
    }

    /**
     * Halts the response with a given status code and message.
     *
     * @param int $code HTTP Status Code
     * @param string|null $message General message
     * @param string|null $errorMessage Detailed error message (if applicable)
     * @param mixed $data Response data (default is empty array `[]`)
     */
    private static function haltResponse(int $code = 500, string $message = null, string $errorMessage = null, $data = [])
    {
        Flight::halt($code, json_encode([
            "status_code" => $code,
            "message" => $message ?? "Erro!",
            "error_message" => $errorMessage,
            "data" => empty($data) ? null : $data
        ]));
    }

    /**
     * Returns a validation error response.
     *
     * @param string $message Error message
     * @param int $code HTTP Status Code
     */
    public static function returnValidationError(string $message = "Os campos preenchidos são inválidos.", int $code = 400)
    {
        HttpResponse::haltResponse(
            $code,
            $message
        );
    }

    /**
     * Triggers an error response with logging.
     *
     * @param string $message General error message
     * @param string $methodName Method name where the error occurred
     * @param string $error Detailed error message
     * @param int $code HTTP Status Code
     */
    public static function triggerError(string $message = "Desculpe, ocorreu um erro no servidor. Se o problema persistir, tente novamente mais tarde!", string $methodName, string $error = "desconhecido", int $code = 500)
    {
        // Format the error message
        $formattedError = "Error in {$methodName}: " . $error;

        // Log the error
        error_log($formattedError);

        HttpResponse::haltResponse(
            $code,
            $message,
            "Erro no servidor: $error"
        );
    }

    /**
     * Handles a general exception and triggers an error response.
     *
     * @param \Exception $e Exception instance
     * @param string $methodName Method name where the exception occurred
     * @param string $message General error message
     * @param int $code HTTP Status Code
     */
    public static function handleException(\Exception $e, string $methodName, string $message = "desconhecido", int $code = 500)
    {
        self::checkIfDuplicateEntryException($e);
        HttpResponse::triggerError("Desculpe, houve um erro no servidor: $message", $methodName, $e->getMessage(), $code);
    }

    /**
     * Handles a PDO exception and triggers an error response.
     *
     * @param \PDOException $e PDOException instance
     * @param string $methodName Method name where the exception occurred
     * @param string $message General error message
     * @param int $code HTTP Status Code
     */
    public static function handlePdoException(\PDOException $e, string $methodName, string $message = "desconhecido", int $code = 500)
    {
        self::checkIfDuplicateEntryException($e);
        HttpResponse::triggerError("Desculpe, houve um erro no servidor: $message", $methodName, $e->getMessage(), $code);
    }

    /**
     * Handles a throwable error and triggers an error response.
     *
     * @param \Throwable $e Throwable instance
     * @param string $methodName Method name where the error occurred
     * @param string $message General error message
     * @param int $code HTTP Status Code
     */
    public static function handleThrowable(\Throwable $e, string $methodName, string $message = "desconhecido", int $code = 500)
    {
        self::checkIfDuplicateEntryException($e);
        HttpResponse::triggerError("Desculpe, houve um erro no servidor: $message", $methodName, $e->getMessage(), $code);
    }

    /**
     * Checks if the exception is a duplicate entry error and returns a validation error.
     *
     * @param \Throwable $e Throwable instance
     */
    private static function checkIfDuplicateEntryException(\Throwable $e)
    {
        // Check if it's a duplicate entry error (SQLSTATE 23000, MySQL error code 1062)
        if ($e instanceof \PDOException && $e->getCode() == 23000 && strpos($e->getMessage(), '1062 Duplicate entry') !== false) {
            // Extract reference value causing the error (optional, but useful for better messages)
            preg_match("/Duplicate entry '(.+?)'/", $e->getMessage(), $matches);
            $reference = $matches[1] ?? 'já existente';

            // Redirect to validation error
            HttpResponse::returnValidationError("A referência já está em uso!");
        }
    }
}
