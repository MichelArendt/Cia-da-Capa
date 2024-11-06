<?php

namespace App\Http\Controllers\Public\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
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
