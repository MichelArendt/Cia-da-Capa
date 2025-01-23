<?php
namespace Models;

use PDO;

class UserModel {
  private $db;

  public function __construct(PDO $db) {
    $this->db = $db;
    $this->createTableIfNotExists();
    $this->createAdminUserIfNotExists();
  }

  // Check if the table exists and create it if necessary
  private function createTableIfNotExists() {
      $query = "CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          token VARCHAR(64) NULL,
          expires_at TIMESTAMP NULL
      )";

      $this->db->exec($query);
  }

  // Check if the table exists and create it if necessary
  private function createAdminUserIfNotExists() {
      $stmt = $this->db->prepare("SELECT id FROM users WHERE username = ?");
      $stmt->execute(['admin']);
      $adminUser = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$adminUser) {
        $stmt = $this->db->prepare("INSERT INTO users (username, password, token, expires_at) VALUES (?, ?, NULL, NULL)");
        $stmt->execute([
            'admin',
            password_hash('admin', PASSWORD_DEFAULT)
        ]);
        error_log("Admin user created");
    }
  }

  public function login($username, $password) {
    // 1) Validate the user
    $stmt = $this->db->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        return null; // Invalid credentials
    }

    // Generate a token & store it
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', time() + 86400 * 7);

    $stmt = $this->db->prepare("UPDATE users SET token = ?, expires_at = ? WHERE id = ?");
    $stmt->execute([$token, $expiresAt, $user['id']]);

    // Return the token
    return $token;
  }

  public function logout($token){
    error_log("UserModel logout");

    $stmt = $this->db->prepare("SELECT id FROM users WHERE token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        error_log("User found, logging out");
        $stmt = $this->db->prepare("UPDATE users SET token = NULL WHERE id = ?");
        $stmt->execute([$user['id']]);
    } else {
        error_log("User not found");
    }
  }

  // // Update user session token
  // public function updateToken($user, $token) {
  //   $expiresAt = date('Y-m-d H:i:s', time() + 86400 * 7); // Expires in 7 days
  //   $stmt = $this->db->prepare("UPDATE users SET token = ?, expires_at = ? WHERE id = ?");
  //   return $stmt->execute([$token, $expiresAt, $userId]);
  // }

  // Validate user login
  // public function validateUser($username, $password) {
  //     $user = R::findOne('users', 'username = ?', [$username]);

  //     if ($user && password_verify($password, $user['password'])) {
  //         return $user;
  //     }
  //     return false;
  // }

  // public function cleanupExpiredTokens() {
  //   $stmt = $this->db->prepare("UPDATE users SET token = NULL WHERE expires_at < NOW()");
  //   return $stmt->execute();
  // }
}
?>