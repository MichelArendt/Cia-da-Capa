<?php
namespace Controllers\Manage;

use Flight;
use Helpers\HttpResponse;
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

    HttpResponse::responseNoContent();
  }

  public function validateSession() {
    HttpResponse::responseNoContent();
  }
}
?>