<?php

namespace Controllers\Public;

use Flight;
use Helpers\HttpResponse;

class UserController {
  public function login() {
    // Get JSON request body
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['username']) || !isset($data['password'])) {
      HttpResponse::returnValidationError("Usuário e senha são obrigatórios.");
    }

    $userModel = Flight::get('userModel');

    // Validate user credentials
    $token = $userModel->login($data['username'], $data['password']);

    if (!$token) {
      // null means invalid credentials
      HttpResponse::returnValidationError("Credenciais inválidas.", 401);
    }

    // If we got a token, set the cookie here in the controller
    setcookie('session_token', $token, [
        'expires' => time() + (86400 * 7),
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Strict',
        'secure' => isset($_SERVER['HTTPS'])
    ]);

    HttpResponse::responseNoContent();
  }
}
?>