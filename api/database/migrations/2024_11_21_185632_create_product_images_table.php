<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // Links image to a product
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->onDelete('cascade'); // Links image to a variant, nullable for product-level images
            $table->string('file_path'); // File path for storing image location
            $table->unsignedInteger('priority')->nullable(); // Determines the order of images
            $table->timestamps(); // Created and updated timestamps

            // Ensures priority is unique within a product or variant
            $table->unique(['product_id', 'product_variant_id', 'priority'], 'unique_image_priority_per_product_variant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
