<?php

namespace Helpers;

use Flight;

class ErrorHandler
{

    public static function triggerError(string $error, string $methodName, string $message = "Erro no servidor.", int $code = 500)
    {
        // Format the error message
        $formattedError = "Error in {$methodName}: " . $error;

        // Log the error
        error_log($formattedError);

        // Stop execution and return a JSON response
        Flight::halt($code, json_encode([
            "message" => $message,
            "error_message" => $error,
            "status_code" => $code
        ]));
    }

    public static function handleException(\Exception $e, string $methodName, string $message = "Erro no servidor.", int $code = 500)
    {
        ErrorHandler::triggerError($e->getMessage(), $methodName, $message, $code);
    }
}
