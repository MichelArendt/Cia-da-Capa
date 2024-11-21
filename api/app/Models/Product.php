<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model for managing products.
 * Includes relationships to fetch associated images and variants.
 */
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'description',
        'category_id',
        'is_active',
        'is_highlighted',
        'priority',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    /**
     * Relationship: A product has many variants.
     */
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function sizes()
    {
        return $this->hasMany(ProductSize::class);
    }

    /**
     * Relationship: A product has many images.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class)->whereNull('product_variant_id')->orderBy('priority');
    }
}
