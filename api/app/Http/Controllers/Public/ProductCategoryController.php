<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;

class ProductCategoryController extends Controller
{
    /**
     * Fetch all active product categories.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        // Retrieve all active product categories
        $categories = ProductCategory::where('is_active', true)->get();

        // Return the categories as a JSON response
        return response()->json($categories);
    }
}
