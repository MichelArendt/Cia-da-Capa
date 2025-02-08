<?php

require 'flight/Flight.php';
require 'flight/helpers/ErrorHandler.php';

// --------------------------------
// FILE UPLOAD
// --------------------------------
define('API_ROOT', dirname(__FILE__)); // Current file's directory
define('WEBSITE_ROOT', dirname(API_ROOT)); // One level above API_ROO
Flight::set('api_root', API_ROOT);
Flight::set('website_root', WEBSITE_ROOT);

// Define the upload directory path
$uploadDir = WEBSITE_ROOT . "/images/products/";

// Ensure the directory exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true); // Recursively create the directory
}

// Now, safely use realpath() to normalize the path
Flight::set('upload-dir__product', realpath($uploadDir));
Flight::set('upload-image__max-file-size', 5 * 1024 * 1024); // 5MB

// --------------------------------
// BASE CONFIGURATION
// --------------------------------
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
  error_log($e->getMessage());
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
require 'flight/controllers/public/ProductImageController.php';
require 'flight/controllers/public/ProductVariantController.php';
require 'flight/controllers/public/ProductSizeLabelController.php';

// --------------------------------
// CONTROLLERS - manage
// --------------------------------
require 'flight/controllers/manage/UserController.php';
require 'flight/controllers/manage/ProductController.php';
require 'flight/controllers/manage/ProductCategoryController.php';
require 'flight/controllers/manage/ProductImageController.php';
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

// Product Images
Flight::route('GET /public/products/@id/images', 'Controllers\Public\ProductImageController->getImagesByProductId');
// Flight::route('GET /public/products/@id/images/', 'Controllers\Public\ProductController->getById');

// Product Variants
Flight::route('GET /public/products/@id/variants', 'Controllers\Public\ProductVariantController->getVariantsForProductWithId');

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
Flight::route('DELETE /manage/products/size-labels/@id', 'Controllers\Manage\ProductSizeLabelController->delete');

// Product Images
Flight::route('POST /manage/products/@id/images/upload', 'Controllers\Manage\ProductImageController->uploadImage');
Flight::route('DELETE /manage/products/images/@image_id', 'Controllers\Manage\ProductImageController->deleteByIdAndReorderPriorities');
Flight::route('POST /manage/products/images/update-ordering', 'Controllers\Manage\ProductImageController->updateOrdering');

// Product Variants
Flight::route('POST /manage/products/@id/variant/@variantId/images/upload', 'Controllers\Manage\ProductImageController->uploadVariantImage');

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
// Global error handler
// --------------------------------
Flight::map('error', function (Throwable $ex) {
  error_log("Flight Error: " . $ex->getMessage()); // Log the error

  // Set HTTP 500
  Flight::halt(500, json_encode([
    'success' => false,
    'error'   => 'Internal Server Error',
    'message' => $ex->getMessage()
  ]));
});

// --------------------------------
// START FRAMEWORK
// --------------------------------
Flight::start();