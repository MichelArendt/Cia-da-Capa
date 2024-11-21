<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    /**
     * Store product images.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'images.*.file' => 'required|image|max:2048', // 2MB max
            'images.*.priority' => 'required|integer',
            'product_id' => 'required_without:variant_id|exists:products,id',
            'variant_id' => 'required_without:product_id|exists:product_variants,id',
        ]);

        $uploadedImages = [];

        foreach ($validated['images'] as $imageData) {
            $path = $imageData['file']->store('product-images', 'public');
            $image = ProductImage::create([
                'product_id' => $request->input('product_id', null),
                'variant_id' => $request->input('variant_id', null),
                'file_path' => $path,
                'priority' => $imageData['priority'],
            ]);
            $uploadedImages[] = $image;
        }

        return response()->json([
            'message' => 'Images uploaded successfully.',
            'images' => $uploadedImages,
        ]);
    }

    /**
     * Fetch product or variant images.
     */
    public function index(Request $request)
    {
        $request->validate([
            'product_id' => 'required_without:variant_id|exists:products,id',
            'variant_id' => 'required_without:product_id|exists:product_variants,id',
        ]);

        $images = ProductImage::query()
            ->where('product_id', $request->input('product_id'))
            ->orWhere('variant_id', $request->input('variant_id'))
            ->orderBy('priority')
            ->get();

        return response()->json($images);
    }

    /**
     * Update image priority.
     */
    public function updatePriority(Request $request, $id)
    {
        $request->validate([
            'priority' => 'required|integer',
        ]);

        $image = ProductImage::findOrFail($id);
        $image->priority = $request->input('priority');
        $image->save();

        return response()->json(['message' => 'Priority updated successfully.']);
    }

    /**
     * Delete an image.
     */
    public function destroy($id)
    {
        $image = ProductImage::findOrFail($id);

        // Remove file from storage
        Storage::disk('public')->delete($image->file_path);

        $image->delete();

        return response()->json(['message' => 'Image deleted successfully.']);
    }
}