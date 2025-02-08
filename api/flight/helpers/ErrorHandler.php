<?php

namespace Helpers;

use Flight;

class ErrorHandler
{
    public static function handleException(\Exception $e, string $methodName, string $message = "Erro no servidor.")
    {
        // Format the error message
        $formattedError = "Error in {$methodName}: " . $e->getMessage();

        // Log the error
        error_log($formattedError);

        // Stop execution and return a JSON response
        Flight::halt(500, json_encode([
            "error" => $formattedError,
            "message" => $message
        ]));
    }

    public static function logError(string $error, string $methodName, string $message = "Erro no servidor.", int $code = 500)
    {
        // Format the error message
        $formattedError  = "Error in {$methodName}: " . $error;

        // Log the error
        error_log($formattedError);

        // Stop execution and return a JSON response
        Flight::halt($code, json_encode([
            "error" => $formattedError,
            "message" => $message
        ]));
    }
}
