<?php
namespace Models;

use R;

class ProductModel {
//   private $db;

  public function __construct() {
    //   $this->db = $pdo;
      $this->createTableIfNotExists();
  }

  // ✅ Check if the table exists and create it if necessary
  private function createTableIfNotExists() {
      R::exec("CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          reference VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          category_id INT NOT NULL,
          is_active TINYINT(1) DEFAULT 1,
          is_highlighted TINYINT(1) DEFAULT 0,
          priority INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE
      )");

    //   $this->db->exec($query);
  }
}
?>