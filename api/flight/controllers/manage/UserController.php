<?php
namespace Controllers\Manage;

use Flight;
use PDO;

class UserController {
  public function logout() {
    error_log("UserController logout");
    // // ✅ Get the session token from the cookie
    // if (!isset($_COOKIE['session_token'])) {
    //     http_response_code(401);
    //     echo json_encode(['error' => 'Unauthorized']);
    //     return;
    // }

    // $token = $_COOKIE['session_token'];

    // We already know we're authenticated from the middleware.
    // Just get the token from Flight (no need to read cookie again):
    $token = Flight::get('current_token');
    $userModel = Flight::get('userModel');

    // Attempt to update the user on the database
    $userModel->logout($token);

    // $db = Flight::get('db');

    // // Remove token from database
    // $stmt = $db->prepare("UPDATE users SET token = NULL WHERE token = ?");
    // $stmt->execute([$token]);

    // Expire cookie
    setcookie('session_token', '', [
        'expires' => time() - 3600, // Expire immediately
        'path' => '/'
    ]);

    $message = "Logged out successfully";
    Flight::json(["message" => $message], 200);
  }

  public function validateSession() {
    // $token = Flight::get('current_token');

    // // ✅ Check if the token is valid and not expired
    // $db = Flight::get('db');
    // $stmt = $db->prepare("SELECT id FROM users WHERE token = ? AND expires_at > NOW()");
    // $stmt->execute([$token]);
    // $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // if (!$user) {
    //     http_response_code(401);
    //     echo json_encode(['error' => 'Session expired or invalid']);
    //     return;
    // }

    // ✅ If token is valid, return 200 OK
    error_log("UserController validateSession");
    $message = "Session is valid";
    Flight::json(["message" => $message], 200);
  }
}
?>