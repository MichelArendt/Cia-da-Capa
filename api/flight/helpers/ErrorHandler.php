<?php

namespace Helpers;

use Flight;

class ErrorHandler
{
    public static function handleException(\Exception $e, string $methodName)
    {
        $message = "Error in {$methodName}: " . $e->getMessage();
        error_log($message);
        Flight::json(["message" => $message], 500);
    }

    public static function logError(string $customMessage, string $methodName, int $code = 500)
    {
        $message = "Error in {$methodName}: " . $customMessage;
        error_log($message);
        Flight::json(["message" => $message], $code);
    }
}
