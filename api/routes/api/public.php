<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\Auth\LoginController;

Route::post('/login', [LoginController::class, 'login']);

// Unprotected test route
Route::post('/test', function () {
    return response()->json(['message' => 'API is working']);
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