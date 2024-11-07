<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSize extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'size_label_id', 'width', 'height', 'depth'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function sizeLabel()
    {
        return $this->belongsTo(ProductSizeLabel::class);
    }
}
