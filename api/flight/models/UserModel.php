<?php

namespace Models;

use PDO;
use Exception;
use Helpers\ErrorHandler;

class UserModel
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
        $this->createTableIfNotExists();
        $this->createAdminUserIfNotExists();
    }

    /**
     * Create the `users` table if it doesn't exist
     */
    private function createTableIfNotExists()
    {
        try {
            $query = "CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            token VARCHAR(64) NULL,
            expires_at TIMESTAMP NULL
        )";

            $this->db->exec($query);
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__, "UserModel->createTableIfNotExists()");
        }
    }

    /**
     * If no admin user exists, create one with username 'admin' and password 'admin'.
     */
    private function createAdminUserIfNotExists()
    {
        try {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->execute(['admin']);
            $adminUser = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$adminUser) {
                $stmt = $this->db->prepare("
                    INSERT INTO users (username, password, token, expires_at)
                    VALUES (?, ?, NULL, NULL)
                ");
                $stmt->execute([
                    'admin',
                    password_hash('admin', PASSWORD_DEFAULT)
                ]);

                // Optional: Log info if needed
                error_log("Admin user created by createAdminUserIfNotExists()");
            }
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__, "UserModel->createAdminUserIfNotExists()");
        }
    }

    /**
     * Validate user credentials. If valid, generate a new token and return it.
     * Returns null if invalid credentials.
     */
    public function login(string $username, string $password): ?string
    {
        try {
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
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__, "UserModel->login()");
        }
    }

    /**
     * Invalidate the given token (logout). If token is found, set it to NULL.
     */
    public function logout(string $token): void
    {
        try {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE token = ?");
            $stmt->execute([$token]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $stmt = $this->db->prepare("UPDATE users SET token = NULL, expires_at = NULL WHERE id = ?");
                $stmt->execute([$user['id']]);
                // Optional: log a message
                error_log("UserModel->logout: User with id={$user['id']} logged out successfully.");
            } else {
                // Possibly log a notice if the token didn't match
                error_log("UserModel->logout: No user found with token={$token}.");
            }
        } catch (Exception $e) {
            ErrorHandler::handleException($e, __METHOD__, "UserModel->logout()");
        }
    }
}
