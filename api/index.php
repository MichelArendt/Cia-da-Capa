<?php

require 'flight/Flight.php';
// require 'flight/lib/rb.php'; // RedBeanPHP


require 'flight/models/UserModel.php';
use Models\UserModel;

require 'flight/models/ProductCategoryModel.php';
use Models\ProductCategoryModel;

require 'flight/models/ProductModel.php';
use Models\ProductModel;

require 'flight/models/ProductVariantModel.php';
use Models\ProductVariantModel;

require 'flight/models/ProductSizeLabelModel.php';
use Models\ProductSizeLabelModel;

require 'flight/models/ProductSizeModel.php';
use Models\ProductSizeModel;

require 'flight/models/ProductImageModel.php';
use Models\ProductImageModel;

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
    Flight::set('productCategoryModel', new ProductCategoryModel($pdo));
    Flight::set('productModel', new ProductModel($pdo));
    Flight::set('productVariantModel', new ProductVariantModel($pdo));
    Flight::set('productSizeLabelModel', new ProductSizeLabelModel($pdo));
    Flight::set('productSizeModel', new ProductSizeModel($pdo));
    Flight::set('productImageModel', new ProductImageModel($pdo));
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
require 'flight/controllers/public/ProductController.php';
require 'flight/controllers/public/ProductCategoryController.php';
require 'flight/controllers/public/ProductSizeLabelController.php';

// --------------------------------
// CONTROLLERS - manage
// --------------------------------
require 'flight/controllers/manage/UserController.php';
require 'flight/controllers/manage/ProductController.php';
require 'flight/controllers/manage/ProductCategoryController.php';
require 'flight/controllers/manage/ProductSizeLabelController.php';

// --------------------------------
// ROUTES - public
// --------------------------------
Flight::route('GET /', function () {
  echo 'hello world!';
});

// User
Flight::route('POST /public/user/login', 'Controllers\Public\UserController->login');

// Product Category
Flight::route('GET /public/products/categories', 'Controllers\Public\ProductCategoryController->getAll');

// Product Size Labels
Flight::route('GET /public/products/size-labels', 'Controllers\Public\ProductSizeLabelController->getAll');

// Product
Flight::route('GET /public/products', 'Controllers\Public\ProductController->getAll');
Flight::route('GET /public/products/@id', 'Controllers\Public\ProductController->getById');

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
Flight::route('POST /manage/products', 'Controllers\Manage\ProductController->create');
Flight::route('POST /manage/products/categories', 'Controllers\Manage\ProductCategoryController->create');
Flight::route('DELETE /manage/products/categories/@id', 'Controllers\Manage\ProductCategoryController->delete');

// Product Size Label
Flight::route('POST /manage/products/size-labels', 'Controllers\Manage\ProductSizeLabelController->create');

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