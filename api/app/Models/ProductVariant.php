<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model for managing product variants.
 * Each variant belongs to a product and has its own set of images.
 */
class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'variant_name'];

    /**
     * Relationship: A variant belongs to a product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relationship: A variant has many images.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_variant_id')->orderBy('priority');
    }
}
