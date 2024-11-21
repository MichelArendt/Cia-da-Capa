<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model for managing product images.
 * Each image is linked to a product or product variant and includes metadata like file path and priority.
 */
class ProductImage extends Model
{
    protected $fillable = ['product_id', 'product_variant_id', 'file_path', 'priority'];

    /**
     * Relationship: An image belongs to a product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relationship: An image belongs to a variant (optional).
     */
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
