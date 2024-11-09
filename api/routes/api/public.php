<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

use App\Http\Controllers\Public\UserController;

use App\Http\Controllers\Public\ProductCategoryController;
use App\Http\Controllers\Public\ProductController;

// Authentication
Route::get('/user', [UserController::class, 'checkAuthStatus']);
Route::post('/user/login', [UserController::class, 'login']);

// Product Categories
Route::get('/products/categories', [ProductCategoryController::class, 'index']);

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/{id}/category', [ProductController::class, 'category']);

// fallback route can capture any unmatched routes and log them
Route::fallback(function () {
    $url = request()->fullUrl();
    Log::warning("404 Not Found: {$url}");

    return response()->json(['message' => 'Route not found on /api/public'], 404);
});

// // Route to handle login requests
// Route::post('/login', function (Request $request) {
//     // Extract name and password from the request .payload
//     $credentials = $request->only('name', 'password');

//     // Attempt to authenticate the user with the provided credentials
//     if (!Auth::attempt($credentials)) {
//         // If authentication fails, return a 401 Unauthorized response
//         return response()->json(['error' => 'Invalid credentials'], 401);
//     }

//     // Regenerate the session to prevent session fixation attacks
//     $request->session()->regenerate();

//     // Optionally, you can return the authenticated user's data
//     $user = Auth::user();

//     return response()->json(['message' => 'Logged in', 'user' => $user], 200);
// });

// Route to handle logout requests
// Route::post('/logout', function (Request $request) {
//     // Log out the user
//     Auth::logout();

//     // Invalidate the session
//     $request->session()->invalidate();

//     // Regenerate the CSRF token
//     $request->session()->regenerateToken();

//     return response()->json(['message' => 'Logged out'], 200);
// });