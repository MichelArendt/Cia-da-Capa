<?php

namespace App\Http\Controllers\Manage;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;

class ProductCategoryController extends Controller
{
    /**
     * Handle the creation of a product category.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createCategory(Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:product_categories,name',
            'reference' => 'required|string|max:255|unique:product_categories,reference',
            'is_active' => 'required|boolean',
        ]);

        // Create a new product category
        $category = ProductCategory::create($validatedData);

        // Return a success response
        return response()->json([
            'success' => true,
            'message' => 'Category created successfully.',
            'data' => $category,
        ], 201);
    }
}
