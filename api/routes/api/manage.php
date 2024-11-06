<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Manage\Auth\LogoutController;
use App\Http\Controllers\Manage\UserController;

Route::get('/user', [UserController::class, 'show']);
Route::post('/user/logout', [LogoutController::class, 'logout']);

// Route::middleware('auth:sanctum')->group(function () {
//   // Route to fetch the currently authenticated user's data
//   Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//       // Return user information if authenticated
//       return $request->user();
//   });

//     // Add additional manage routes here
// });