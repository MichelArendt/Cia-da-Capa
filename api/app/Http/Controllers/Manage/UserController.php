<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Route to fetch the currently authenticated user's data
    public function show(Request $request)
    {
      // Return user information if authenticated
      return $request->user();
    }
}
