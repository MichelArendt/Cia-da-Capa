<?php
namespace Controllers\Manage;

use Flight;
use PDO;

class UserController {
  public function logout() {
    // We already know we're authenticated from the middleware.
    // Just get the token from Flight (no need to read cookie again):
    $token = Flight::get('current_token');
    $userModel = Flight::get('userModel');

    // Attempt to update the user on the database
    $userModel->logout($token);

    // Expire cookie
    setcookie('session_token', '', [
        'expires' => time() - 3600, // Expire immediately
        'path' => '/'
    ]);

    $message = "Logged out successfully";
    Flight::json(["message" => $message], 200);
  }

  public function validateSession() {
    // If token is valid, return 200 OK
    $message = "Session is valid";
    Flight::json(["message" => $message], 200);
  }
}
?>