<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    // Fetch the currently authenticated user's data
    public function checkAuthStatus(Request $request)
    {
      // Check if a user is authenticated
      $isAuthenticated = Auth::check();

      return response()->json(['authenticated' => $isAuthenticated]);
    }

    // Attempt login with credentials
    public function login(Request $request)
    {
      $validator = Validator::make($request->all(), [
        'name' => 'required|string',
        'password' => 'required|string',
      ]);

      if ($validator->fails()) {
        Log::warning('Failed login attempt', ['username' => $request->input('name')]);
        return response()->json(['errors' => $validator->errors()], 422);
      }

      // Extract name and password from the request .payload
      $credentials = $request->only('name', 'password');

      // Attempt to authenticate the user with the provided credentials
      if (!Auth::attempt($credentials)) {
          // If authentication fails, return a 401 Unauthorized response
          return response()->json(['error' => 'Invalid credentials'], 401);
      }

      // Regenerate the session to prevent session fixation attacks
      $request->session()->regenerate();


      return response()->json(['authenticated' => true], 200);
    }
}
