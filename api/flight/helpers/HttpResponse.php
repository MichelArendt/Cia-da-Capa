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
            "data" => empty($data) ? null : $data // Ensure empty data is `{}` instead of `[]`
        ], $code);
    }

    public static function responseCreateSuccess($message, $data)
    {
        HttpResponse::response(201, $message, null, $data);
    }

    public static function responseDeleteSuccess($message)
    {
        HttpResponse::response(200, $message, null, null);
    }

    public static function responseUpdateSuccess($message, $data = null)
    {
        HttpResponse::response(200, $message, null, $data);
    }

    public static function responseFetchSuccess($data)
    {
        HttpResponse::response(200, null, null, $data);
    }

    public static function responseNoContent()
    {
        HttpResponse::response(204);
    }

    private static function haltResponse(int $code = 500, string $message = null, string $errorMessage = null, $data = [])
    {
        Flight::halt($code, json_encode([
            "status_code" => $code,
            "message" => $message ?? "Erro!",
            "error_message" => $errorMessage,
            "data" => empty($data) ? null : $data
        ]));
    }

    public static function returnValidationError(string $message = "Os campos preenchidos são inválidos.", int $code = 400)
    {
        HttpResponse::haltResponse(
            $code,
            $message
        );
    }

    public static function triggerError(string $message = "Desculpe, ocorreu um erro no servidor. Se o problema persistir, tente novamente mais tarde!", string $methodName, string $error = "Erro no servidor.", int $code = 500)
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

    public static function handleException(\Exception $e, string $methodName, string $message = "Erro no servidor.", int $code = 500)
    {
        self::checkIfDuplicateEntryException($e);
        HttpResponse::triggerError("Desculpe, houve um erro no servidor: $message", $methodName, $e->getMessage(), $code);
    }

    public static function handlePdoException(\PDOException $e, string $methodName, string $message = "Erro no servidor.", int $code = 500)
    {
        self::checkIfDuplicateEntryException($e);
        HttpResponse::triggerError("Desculpe, houve um erro no servidor: $message", $methodName, $e->getMessage(), $code);
    }

    public static function handleThrowable(\Throwable $e, string $methodName, string $message = "Erro no servidor.", int $code = 500)
    {
        self::checkIfDuplicateEntryException($e);
        HttpResponse::triggerError("Desculpe, houve um erro no servidor: $message", $methodName, $e->getMessage(), $code);
    }

    private static function checkIfDuplicateEntryException(\Exception $e)
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
