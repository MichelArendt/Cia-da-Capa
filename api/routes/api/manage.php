<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Manage\UserController;
use App\Http\Controllers\Manage\ProductCategoryController;
use App\Http\Controllers\ProductController;

// User Management
Route::post('/user/logout', [UserController::class, 'logout']);

// Highlight a product
Route::post('/products/{product}/highlight', [ProductController::class, 'highlight']);

// Un-highlight a product
Route::delete('/products/{product}/highlight', [ProductController::class, 'unhighlight']);

// Reorder highlighted products within a category
Route::put('/products/categories/{category}/highlight/reorder', [ProductController::class, 'reorderHighlightedProducts']);






// // Product Categories Management
// Route::post('/products/categories', [ProductCategoryController::class, 'store']);
// Route::put('/products/categories/{id}', [ProductCategoryController::class, 'update']);
// Route::delete('/products/categories/{id}', [ProductCategoryController::class, 'destroy']);

// // Products Management
// Route::post('/products', [ProductController::class, 'store']);
// Route::put('/products/{id}', [ProductController::class, 'update']);
// Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// Route::middleware('auth:sanctum')->group(function () {
//   // Route to fetch the currently authenticated user's data
//   Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//       // Return user information if authenticated
//       return $request->user();
//   });

//     // Add additional manage routes here
// });