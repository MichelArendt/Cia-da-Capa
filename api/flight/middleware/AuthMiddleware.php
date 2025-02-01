<?php

namespace app\middleware;

use Flight;
use PDO;

class AuthMiddleware {
    public static function checkAuth() {

        // First, check if ANY cookies exist
        if (empty($_COOKIE)) {
            $message = "Unauthorized: No cookies found.";
            error_log($message . ": " . json_encode($_COOKIE)); // Log all cookies for debugging
            Flight::json(["message" => $message], 401);
            exit;
        }

        // Second, check if the 'session_token' key exists
        if (!isset($_COOKIE['session_token'])) {
            $message = "Unauthorized: Session token is missing.";
            error_log($message . ": " . json_encode($_COOKIE['session_token'])); // Log all cookies for debugging
            Flight::json(["message" => $message], 401);
            exit;
        }

        $token = $_COOKIE['session_token'];
        // error_log("AuthMiddleware: Received token (" . $token . ")");

        // Get PDO instance from Flight
        $db = Flight::get('db');

        // Check if the token is valid and not expired
        $stmt = $db->prepare("SELECT id FROM users WHERE token = ? AND expires_at > NOW()");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            $message = "Unauthorized: Session is invalid.";
            Flight::json(["message" => $message], 401);
            exit;
        }

        // Token is valid → Allow access
        Flight::set('current_token', $token);
        error_log("Allowed access (" . $token . ")");
    }
}