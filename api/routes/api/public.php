<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

use App\Http\Controllers\Public\UserController;

use App\Http\Controllers\Public\ProductCategoryController;
use App\Http\Controllers\Public\ProductController;

// ------------------------------------------
// Authentication
// ------------------------------------------
Route::get('/user', [UserController::class, 'checkAuthStatus']);
Route::post('/user/login', [UserController::class, 'login'])->middleware('throttle:login');

// ------------------------------------------
// Product Categories
// ------------------------------------------
Route::get('/products/categories', [ProductCategoryController::class, 'index']);

// ------------------------------------------
// Products
// ------------------------------------------
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/{id}/category', [ProductController::class, 'category']);

// Images
Route::get('/products/{id}/images', [ProductController::class, 'images']);

// fallback route can capture any unmatched routes and log them
Route::fallback(function () {
    $url = request()->fullUrl();
    Log::warning("404 Not Found: {$url}");

    return response()->json(['message' => 'Route not found on /api/public'], 404);
});