<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Updated field names to match the database schema
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

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function sizes()
    {
        return $this->hasMany(ProductSize::class);
    }
}
