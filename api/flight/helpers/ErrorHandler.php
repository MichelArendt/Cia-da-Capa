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
}
