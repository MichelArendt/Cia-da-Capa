<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Fetch the currently authenticated user's data
    public function checkAuthStatus(Request $request)
    {
      // Sanctum automatically verifies the session cookie and authenticates the user
      return response()->json(['authenticated' => true]);; // Returns the user object if authenticated
    }

    // Attempt login with credentials
    public function login(Request $request)
    {
      // Extract name and password from the request .payload
      $credentials = $request->only('name', 'password');

      // Attempt to authenticate the user with the provided credentials
      if (!Auth::attempt($credentials)) {
          // If authentication fails, return a 401 Unauthorized response
          return response()->json(['error' => 'Invalid credentials'], 401);
      }

      // Regenerate the session to prevent session fixation attacks
      $request->session()->regenerate();

      // Optionally, you can return the authenticated user's data
      $user = Auth::user();

      return response()->json(['message' => 'Logged in', 'user' => $user], 200);
    }
}
