<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderHighlightedProductsRequest extends FormRequest
{
    public function rules()
    {
        return [
            'product_ids' => 'required|array',
            'product_ids.*' => 'integer|exists:products,id',
        ];
    }

    public function messages()
    {
        return [
            'product_ids.required' => 'The product_ids field is required.',
            'product_ids.array' => 'The product_ids must be an array.',
            'product_ids.*.integer' => 'Each product ID must be an integer.',
            'product_ids.*.exists' => 'One or more product IDs do not exist.',
        ];
    }
}
