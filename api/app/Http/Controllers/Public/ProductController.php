<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    // Fetch all products
    public function index()
    {
        return Product::all();
    }

    // Fetch images of a product
    public function images($id)
    {
        $product = Product::with(['images' => function ($query) {
            $query->orderBy('priority'); // Ensure images are ordered by priority
        }])->findOrFail($id);

        return response()->json($product->images);
    }
}
