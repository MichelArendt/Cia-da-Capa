<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Manage\UserController;
use App\Http\Controllers\Manage\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;

// ------------------------------------------
// User
// ------------------------------------------

// User Management
Route::post('/user/logout', [UserController::class, 'logout']);

// ------------------------------------------
// Product
// ------------------------------------------

// Create a product
Route::post('/products/categories', [ProductCategoryController::class, 'createCategory']);

// Highlight a product
Route::post('/products/{product}/highlight', [ProductController::class, 'highlight']);

// Un-highlight a product
Route::delete('/products/{product}/highlight', [ProductController::class, 'unhighlight']);

// Reorder highlighted products within a category
Route::put('/products/categories/{category}/highlight/reorder', [ProductController::class, 'reorderHighlightedProducts']);


// ------------------------------------------
// Images
// ------------------------------------------

// Upload images
Route::post('/products/images', [ProductImageController::class, 'store']);

// Update priority
Route::put('/products/images/{id}/priority', [ProductImageController::class, 'updatePriority']);

// Delete image
Route::delete('/products/images/{id}', [ProductImageController::class, 'destroy']);