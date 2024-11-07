<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSizeLabel extends Model
{
    use HasFactory;

    protected $fillable = ['label'];

    public function sizes()
    {
        return $this->hasMany(ProductSize::class);
    }
}
