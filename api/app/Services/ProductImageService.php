<?php

namespace App\Services;

use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;

/**
 * Service class for managing product images.
 * Handles adding, removing, and reordering images for products and variants.
 */
class ProductImageService
{
    /**
     * Add a new image and assign it the next available priority.
     */
    public function addImage(int $productId, string $filePath, int $variantId = null)
    {
        DB::transaction(function () use ($productId, $filePath, $variantId) {
            $maxPriority = ProductImage::where('product_id', $productId)
                ->where('product_variant_id', $variantId)
                ->max('priority') ?? 0;

            ProductImage::create([
                'product_id' => $productId,
                'product_variant_id' => $variantId,
                'file_path' => $filePath,
                'priority' => $maxPriority + 1,
            ]);
        });
    }

    /**
     * Remove an image and adjust priorities of remaining images.
     */
    public function removeImage(ProductImage $image)
    {
        DB::transaction(function () use ($image) {
            $productId = $image->product_id;
            $variantId = $image->product_variant_id;
            $priority = $image->priority;

            $image->delete();

            // Adjust priorities
            ProductImage::where('product_id', $productId)
                ->where('product_variant_id', $variantId)
                ->where('priority', '>', $priority)
                ->decrement('priority');
        });
    }

    /**
     * Reorder images for a product or variant.
     */
    public function reorderImages(int $productId, array $orderedImageIds, int $variantId = null)
    {
        DB::transaction(function () use ($productId, $orderedImageIds, $variantId) {
            $priority = 1;

            foreach ($orderedImageIds as $imageId) {
                ProductImage::where('id', $imageId)
                    ->where('product_id', $productId)
                    ->where('product_variant_id', $variantId)
                    ->update(['priority' => $priority]);

                $priority++;
            }
        });
    }
}
