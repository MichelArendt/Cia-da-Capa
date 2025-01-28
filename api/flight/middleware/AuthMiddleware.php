<?php

namespace app\middleware;

use Flight;
use PDO;

class AuthMiddleware {
    public static function checkAuth() {

        error_log("AuthMiddleware 1");

        // First, check if ANY cookies exist
        if (empty($_COOKIE)) {
            error_log("AuthMiddleware Cookies: " . json_encode($_COOKIE)); // Log all cookies for debugging
            error_log("AuthMiddleware: No cookies found in request.");
            echo json_encode(['error' => "Unauthorized: No cookies found."]);
            exit;
        }

        // Second, check if the 'session_token' key exists
        if (!isset($_COOKIE['session_token'])) {
            error_log("AuthMiddleware Cookies: " . json_encode($_COOKIE['session_token'])); // Log all cookies for debugging
            error_log("AuthMiddleware: session_token is missing.");
            echo json_encode(['error' => "Unauthorized: Session token is missing."]);
            exit;
        }


        error_log("AuthMiddleware 2");

        $token = $_COOKIE['session_token'];
        error_log("AuthMiddleware: Received token (" . $token . ")");

        // Get PDO instance from Flight
        $db = Flight::get('db');

        // Check if the token is valid and not expired
        $stmt = $db->prepare("SELECT id FROM users WHERE token = ? AND expires_at > NOW()");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        error_log("AuthMiddleware 3");

        if (!$user) {
            error_log("AuthMiddleware 3.3");
            http_response_code(401);
            echo json_encode(['error' => 'Session is invalid']);
            exit;
        }
        error_log("AuthMiddleware 4");

        // Token is valid → Allow access
        Flight::set('current_token', $token);
        error_log("AuthMiddleware 5");
    }
}