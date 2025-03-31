<?php

require 'flight/Flight.php';
require 'flight/helpers/HttpResponse.php';
require 'flight/helpers/ValidationHelper.php';

use Helpers\HttpResponse;

// --------------------------------
// FILE UPLOAD
// --------------------------------
define('API_ROOT', dirname(__FILE__)); // Current file's directory
define('WEBSITE_ROOT', dirname(API_ROOT)); // One level above API_ROOT
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
require 'flight/models/ProductCategoryModel.php';
require 'flight/models/ProductModel.php';
require 'flight/models/ProductVariantModel.php';
require 'flight/models/ProductSizeLabelModel.php';
require 'flight/models/ProductSizeModel.php';
require 'flight/models/ProductImageModel.php';

use Models\UserModel;
use Models\ProductCategoryModel;
use Models\ProductModel;
use Models\ProductVariantModel;
use Models\ProductSizeLabelModel;
use Models\ProductSizeModel;
use Models\ProductImageModel;

// Load Config
$config = require 'flight/config/database.php';

// --------------------------------
// Database
// --------------------------------

// Set Up Database Connection Using Config
$dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";

try {
    $pdo = new PDO($dsn, $config['username'], $config['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Store in Flight
    Flight::set('db', $pdo);

    // Initialize models and create tables if they don't exist
    $userModel = new UserModel();
    $productCategoryModel = new ProductCategoryModel();
    $productModel = new ProductModel();
    $productVariantModel = new ProductVariantModel();
    $productSizeLabelModel = new ProductSizeLabelModel();
    $productSizeModel = new ProductSizeModel();
    $productImageModel = new ProductImageModel();

    $userModel->createTableIfNotExists();
    $userModel->createAdminUserIfNotExists();
    $productCategoryModel->createTableIfNotExists();
    $productModel->createTableIfNotExists();
    $productVariantModel->createTableIfNotExists();
    $productSizeLabelModel->createTableIfNotExists();
    $productSizeModel->createTableIfNotExists();
    $productImageModel->createTableIfNotExists();

    // Store models in Flight
    Flight::set('userModel', $userModel);
    Flight::set('productCategoryModel', $productCategoryModel);
    Flight::set('productModel', $productModel);
    Flight::set('productVariantModel', $productVariantModel);
    Flight::set('productSizeLabelModel', $productSizeLabelModel);
    Flight::set('productSizeModel', $productSizeModel);
    Flight::set('productImageModel', $productImageModel);
} catch (Exception $e) {
    HttpResponse::handleException($e, 'index.php');
}

// --------------------------------
// MIDDLEWARE
// --------------------------------
require 'flight/net/Router.php';
require 'flight/middleware/SecurityHeadersMiddleware.php';

use flight\net\Router;
use app\middleware\SecurityHeadersMiddleware;

// Define routes with security middleware
Flight::group('', function (Router $router) {
    $router->get('/users', ['UserController', 'getUsers']);
    // more routes
}, [new SecurityHeadersMiddleware()]);

// Set JSON content type before starting the framework
Flight::before('start', function () {
    header('Content-Type: application/json');
});

// --------------------------------
// CONTROLLERS - public
// --------------------------------
require 'flight/controllers/public/UserController.php';
require 'flight/controllers/public/ProductController.php';
require 'flight/controllers/public/ProductCategoryController.php';
require 'flight/controllers/public/ProductSizeController.php';
require 'flight/controllers/public/ProductVariantController.php';
require 'flight/controllers/public/ProductImageController.php';
require 'flight/controllers/public/ProductSizeLabelController.php';

// --------------------------------
// CONTROLLERS - manage
// --------------------------------
require 'flight/controllers/manage/UserController.php';
require 'flight/controllers/manage/ProductController.php';
require 'flight/controllers/manage/ProductCategoryController.php';
require 'flight/controllers/manage/ProductSizeController.php';
require 'flight/controllers/manage/ProductVariantController.php';
require 'flight/controllers/manage/ProductImageController.php';
require 'flight/controllers/manage/ProductSizeLabelController.php';

// --------------------------------
// ROUTES - public
// --------------------------------

// User
Flight::route('POST /public/user/login', 'Controllers\Public\UserController->login');

// Product Category
Flight::route('GET /public/products/categories', 'Controllers\Public\ProductCategoryController->getAll');

// Product Size Labels
Flight::route('GET /public/products/size-labels', 'Controllers\Public\ProductSizeLabelController->getAll');

// Product Sizes
Flight::route('GET /public/products/@id/sizes', 'Controllers\Public\ProductSizeController->getSizesForProductId');

// Product Images
Flight::route('GET /public/products/@id/images', 'Controllers\Public\ProductImageController->getImagesForProductId');
Flight::route('GET /public/products/variants/@variantId/images', 'Controllers\Public\ProductImageController->getImagesForVariantId');

// Product Variants
Flight::route('GET /public/products/@id/variants', 'Controllers\Public\ProductVariantController->getVariantsForProductId');

// Product
Flight::route('GET /public/products', 'Controllers\Public\ProductController->getAll');
Flight::route('GET /public/products/@id', 'Controllers\Public\ProductController->getForId');
Flight::route('GET /public/products/@id/full', 'Controllers\Public\ProductController->getForIdFull');

// --------------------------------
// ROUTES - manage
// --------------------------------
require 'flight/middleware/AuthMiddleware.php';

use app\middleware\AuthMiddleware;

// Protect /manage routes
Flight::route('GET|POST|PUT|DELETE /manage/*', function () {
    AuthMiddleware::checkAuth();

    // Continue to next route
    return true;
});

// User
Flight::route('POST /manage/user/logout', 'Controllers\Manage\UserController->logout');
Flight::route('POST /manage/user/validate', 'Controllers\Manage\UserController->validateSession');

// Product Category
Flight::route('POST /manage/products', 'Controllers\Manage\ProductController->create');
Flight::route('PUT /manage/products/categories/@id', 'Controllers\Manage\ProductCategoryController->Update');
Flight::route('POST /manage/products/categories', 'Controllers\Manage\ProductCategoryController->create');
Flight::route('DELETE /manage/products/categories/@id', 'Controllers\Manage\ProductCategoryController->delete');

// Product Size Label
Flight::route('POST /manage/products/size-labels', 'Controllers\Manage\ProductSizeLabelController->create');
Flight::route('PUT /manage/products/size-labels/@id', 'Controllers\Manage\ProductSizeLabelController->Update');
Flight::route('DELETE /manage/products/size-labels/@id', 'Controllers\Manage\ProductSizeLabelController->deleteForIdAndReorderPriorities');
Flight::route('PUT /manage/products/size-labels/update-ordering', 'Controllers\Manage\ProductSizeLabelController->updateOrdering');

// Product Sizes
Flight::route('POST /manage/products/@id/sizes', 'Controllers\Manage\ProductSizeController->create');
Flight::route('PUT /manage/products/sizes/@id', 'Controllers\Manage\ProductSizeController->update');
Flight::route('DELETE /manage/products/sizes/@id', 'Controllers\Manage\ProductSizeController->delete');

// Product Images
Flight::route('POST /manage/products/@id/images', 'Controllers\Manage\ProductImageController->uploadImages');
Flight::route('DELETE /manage/products/images/@image_id', 'Controllers\Manage\ProductImageController->deleteForIdAndReorderPriorities');
Flight::route('POST /manage/products/images/update-ordering', 'Controllers\Manage\ProductImageController->updateOrdering');

// Product Variants
Flight::route('POST /manage/products/variants/@variantId/images', 'Controllers\Manage\ProductImageController->uploadVariantImages');
Flight::route('POST /manage/products/@id/variants', 'Controllers\Manage\ProductVariantController->create');
Flight::route('PUT /manage/products/variants/@variantId', 'Controllers\Manage\ProductVariantController->update');
Flight::route('DELETE /manage/products/variants/@variantId', 'Controllers\Manage\ProductVariantController->delete');

// Product
Flight::route('PUT /manage/products/@id', 'Controllers\Manage\ProductController->update');

// --------------------------------
// ROUTES - 404
// --------------------------------
Flight::map('notFound', function () {
    $request = Flight::request();
    $attemptedRoute = $request->url;

    HttpResponse::triggerError(
        "Route not found: $attemptedRoute",
        'index.php',
        "Rota não encontrada: $attemptedRoute",
        404
    );
});

// --------------------------------
// ROUTES - debug
// --------------------------------
Flight::route('GET /debug/routes', function () {
    $routes = Flight::router()->getRoutes();

    HttpResponse::responseFetchSuccess($routes);
});

// --------------------------------
// Global error handler
// --------------------------------
Flight::map('error', function (Throwable $e) {
    HttpResponse::handleThrowable($e, 'index.php->Global error handler');
});

// --------------------------------
// START FRAMEWORK
// --------------------------------
Flight::start();
