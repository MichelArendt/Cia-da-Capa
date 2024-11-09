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