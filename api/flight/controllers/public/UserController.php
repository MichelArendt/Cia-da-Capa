<?php

namespace Controllers\Public;

use Flight;

class UserController {
  public function login() {
    // Get JSON request body
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['username']) || !isset($data['password'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing username or password']);
      return;
    }

    $userModel = Flight::get('userModel');

    // Validate user credentials
    $token = $userModel->login($data['username'], $data['password']);

    if (!$token) {
      // null means invalid credentials
      http_response_code(401);
      echo json_encode(['error' => 'Invalid credentials']);
      return;
    }

    // If we got a token, set the cookie here in the controller
    setcookie('session_token', $token, [
        'expires' => time() + (86400 * 7),
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Strict',
        'secure' => isset($_SERVER['HTTPS'])
    ]);

    echo json_encode(['message' => 'Login successful']);
  }
}
?>