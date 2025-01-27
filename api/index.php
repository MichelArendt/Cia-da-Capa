<?php

require 'flight/Flight.php';
// require 'flight/lib/rb.php'; // RedBeanPHP


require 'flight/models/UserModel.php';
require 'flight/models/ProductModel.php';
require 'flight/models/ProductCategoryModel.php';
use Models\UserModel;
use Models\ProductModel;
use Models\ProductCategoryModel;

// Load Config
$config = require 'flight/config/database.php';

// Set Up Database Connection Using Config
$dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
// R::setup($dsn, $config['username'], $config['password']);

// Prevent RedBean from modifying schema in production
// R::freeze(true);

// Store RedBean instance in Flight (for easy access later)
// Flight::set('rb', R::getRedBean());

// // Register UserModel in Flight
// require 'flight/models/UserModel.php';
// Flight::set('userModel', new UserModel());

try {
    $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Store in Flight
    Flight::set('db', $pdo);

    Flight::set('userModel', new UserModel($pdo));
    Flight::set('productModel', new ProductModel($pdo));
    Flight::set('productCategoryModel', new ProductCategoryModel($pdo));
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}

// --------------------------------
// MIDDLEWARE
// --------------------------------
require 'flight/net/Router.php';
require 'flight/middleware/SecurityHeadersMiddleware.php';
use flight\net\Router;
use app\middleware\SecurityHeadersMiddleware;
Flight::group('', function(Router $router) {
    $router->get('/users', [ 'UserController', 'getUsers' ]);
    // more routes
}, [ new SecurityHeadersMiddleware() ]);
Flight::before('start', function () {
    header('Content-Type: application/json');
});

// --------------------------------
// CONTROLLERS - public
// --------------------------------
require 'flight/controllers/public/UserController.php';
require 'flight/controllers/public/ProductCategoryController.php';

// --------------------------------
// CONTROLLERS - manage
// --------------------------------
require 'flight/controllers/manage/UserController.php';
require 'flight/controllers/manage/ProductCategoryController.php';

// --------------------------------
// ROUTES - public
// --------------------------------
Flight::route('GET /', function () {
  echo 'hello world!';
});

// User
Flight::route('POST /public/user/login', 'Controllers\Public\UserController->login');

// Product
Flight::route('GET /public/products', 'Controllers\Public\ProductController->getAll');

// Product Category
Flight::route('GET /public/products/categories', 'Controllers\Public\ProductCategoryController->getAll');

// --------------------------------
// ROUTES - manage
// --------------------------------
require 'flight/middleware/AuthMiddleware.php';
use app\middleware\AuthMiddleware;

// Protect /manage routes
Flight::route('GET|POST|PUT|DELETE /manage/*', function() {
  AuthMiddleware::checkAuth();

  // Continue to next route
  return true;
});

// User
Flight::route('POST /manage/user/logout', 'Controllers\Manage\UserController->logout');
Flight::route('POST /manage/user/validate', 'Controllers\Manage\UserController->validateSession');

// Product Category
Flight::route('POST /manage/products/categories', 'Controllers\Manage\ProductCategoryController->create');
Flight::route('DELETE /manage/products/categories/@id', 'Controllers\Manage\ProductCategoryController->delete');

// --------------------------------
// ROUTES - 404
// --------------------------------
Flight::map('notFound', function () {
  Flight::json([
      'status' => 404,
      'error' => 'Route not found'
  ], 404);
});

// --------------------------------
// ROUTES - debug
// --------------------------------
Flight::route('GET /debug/routes', function () {
  $routes = Flight::router()->getRoutes();

  header('Content-Type: application/json');
  echo json_encode($routes, JSON_PRETTY_PRINT);
});

// --------------------------------
// START FRAMEWORK
// --------------------------------
Flight::start();