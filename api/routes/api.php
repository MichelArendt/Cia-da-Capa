<?php

use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('public')->group(base_path('routes/api/public.php'));

// Manage (authenticated) routes
Route::middleware('auth:sanctum')->prefix('manage')->group(base_path('routes/api/manage.php'));

// Unprotected test route
Route::post('/test', function () {
    return response()->json(['message' => 'API is working']);
});