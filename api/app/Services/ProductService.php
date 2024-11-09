<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService
{
    /**
     * Highlight a product by assigning it the next available priority in its category.
     *
     * @param Product $product
     * @return void
     * @throws \Exception
     */
    public function highlightProduct(Product $product)
    {
        $categoryId = $product->category_id;

        DB::transaction(function () use ($product, $categoryId) {
            // Get the maximum priority among highlighted products in the same category
            $maxPriority = Product::where('category_id', $categoryId)
                ->where('is_highlighted', true)
                ->max('priority');

            $product->is_highlighted = true;
            $product->priority = $maxPriority ? $maxPriority + 1 : 1;
            $product->save();
        });
    }

    /**
     * Un-highlight a product and adjust priorities of remaining highlighted products.
     *
     * @param Product $product
     * @return void
     * @throws \Exception
     */
    public function unhighlightProduct(Product $product)
    {
        $categoryId = $product->category_id;
        $oldPriority = $product->priority;

        DB::transaction(function () use ($product, $categoryId, $oldPriority) {
            $product->is_highlighted = false;
            $product->priority = null;
            $product->save();

            // Decrement priorities of highlighted products with higher priority values
            Product::where('category_id', $categoryId)
                ->where('is_highlighted', true)
                ->where('priority', '>', $oldPriority)
                ->decrement('priority');
        });
    }

    /**
     * Reorder highlighted products based on the provided order.
     *
     * @param int $categoryId
     * @param array $orderedProductIds Array of product IDs in the desired order
     * @return void
     * @throws \Exception
     */
    public function reorderHighlightedProducts(int $categoryId, array $orderedProductIds)
    {
        DB::transaction(function () use ($categoryId, $orderedProductIds) {
            $priority = 1;

            foreach ($orderedProductIds as $productId) {
                Product::where('id', $productId)
                    ->where('category_id', $categoryId)
                    ->where('is_highlighted', true)
                    ->update(['priority' => $priority]);

                $priority++;
            }
        });
    }

    /**
     * Highlight a product at a specific priority position.
     *
     * @param Product $product
     * @param int $desiredPriority
     * @return void
     * @throws \Exception
     */
    public function highlightProductAtPriority(Product $product, int $desiredPriority)
    {
        $categoryId = $product->category_id;

        DB::transaction(function () use ($product, $categoryId, $desiredPriority) {
            // Increment priorities of existing highlighted products at or after the desired priority
            Product::where('category_id', $categoryId)
                ->where('is_highlighted', true)
                ->where('priority', '>=', $desiredPriority)
                ->increment('priority');

            $product->is_highlighted = true;
            $product->priority = $desiredPriority;
            $product->save();
        });
    }
}
