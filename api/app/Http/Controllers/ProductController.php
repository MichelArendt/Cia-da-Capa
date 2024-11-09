<?php

namespace App\Http\Controllers;

use App\Http\Requests\HighlightProductRequest;
use App\Http\Requests\ReorderHighlightedProductsRequest;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;

    /**
     * Inject the ProductService into the controller.
     *
     * @param ProductService $productService
     */
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Highlight a product.
     *
     * @param HighlightProductRequest $request
     * @param int $productId
     * @return \Illuminate\Http\JsonResponse
     */
    public function highlight(HighlightProductRequest $request, $productId)
    {
        $product = Product::findOrFail($productId);

        try {
            if ($request->has('priority')) {
                $this->productService->highlightProductAtPriority($product, $request->input('priority'));
            } else {
                $this->productService->highlightProduct($product);
            }

            return response()->json(['message' => 'Product highlighted successfully.'], 200);
        } catch (\Exception $e) {
            // Log the exception if needed
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Un-highlight a product.
     *
     * @param int $productId
     * @return \Illuminate\Http\JsonResponse
     */
    public function unhighlight($productId)
    {
        $product = Product::findOrFail($productId);

        try {
            $this->productService->unhighlightProduct($product);
            return response()->json(['message' => 'Product un-highlighted successfully.'], 200);
        } catch (\Exception $e) {
            // Log the exception if needed
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Reorder highlighted products within a category.
     *
     * @param ReorderHighlightedProductsRequest $request
     * @param int $categoryId
     * @return \Illuminate\Http\JsonResponse
     */
    public function reorderHighlightedProducts(ReorderHighlightedProductsRequest $request, $categoryId)
    {
        $productIds = $request->input('product_ids');

        try {
            $this->productService->reorderHighlightedProducts($categoryId, $productIds);
            return response()->json(['message' => 'Highlighted products reordered successfully.'], 200);
        } catch (\Exception $e) {
            // Log the exception if needed
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    // ... Other methods such as index, show, store, update, destroy
}
