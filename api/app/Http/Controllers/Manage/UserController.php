<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function logout(Request $request)
    {
      // Use the 'web' guard to log out
      Auth::guard('web')->logout();

      // Invalidate the session
      $request->session()->invalidate();

      // Regenerate the CSRF token
      $request->session()->regenerateToken();

      return response()->json(['message' => 'Logged out'], 200);
    }
}
