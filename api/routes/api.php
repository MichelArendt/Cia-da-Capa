<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

// Public routes
Route::prefix('public')->group(base_path('routes/api/public.php'));

// Manage (authenticated) routes
Route::middleware('auth:sanctum')->prefix('manage')->group(base_path('routes/api/manage.php'));

// fallback route can capture any unmatched routes and log them
Route::fallback(function () {
    Log::warning("Fallback route hit: " . request()->fullUrl());

    return response()->json(['message' => 'Route not found on /api/'], 404);
});