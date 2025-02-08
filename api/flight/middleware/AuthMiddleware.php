<?php

namespace app\middleware;

use Flight;
use PDO;

class AuthMiddleware {
    public static function checkAuth() {
        // First, check if ANY cookies exist
        if (empty($_COOKIE)) {
            $message = "Unauthorized: No cookies found.";
            Flight::halt(401, json_encode(["message" => $message]));
            exit;
        }

        // Second, check if the 'session_token' key exists
        if (!isset($_COOKIE['session_token'])) {
            $message = "Unauthorized: Session token is missing.";
            Flight::halt(401, json_encode(["message" => $message]));
            exit;
        }

        $token = $_COOKIE['session_token'];

        // Get PDO instance from Flight
        $db = Flight::get('db');

        // Check if the token is valid and not expired
        $stmt = $db->prepare("SELECT id FROM users WHERE token = ? AND expires_at > NOW()");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            $message = "Unauthorized: Session is invalid.";
            Flight::halt(401, json_encode(["message" => $message]));
            exit;
        }

        // Token is valid → Allow access
        Flight::set('current_token', $token);
        error_log("Allowed access (" . $token . ")");
    }
}