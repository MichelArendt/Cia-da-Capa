<?php

namespace App\Http\Controllers\Manage\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    public function logout(Request $request)
    {
      // Log out the user
      Auth::logout();

      // Invalidate the session
      $request->session()->invalidate();

      // Regenerate the CSRF token
      $request->session()->regenerateToken();

      return response()->json(['message' => 'Logged out'], 200);
    }
}
