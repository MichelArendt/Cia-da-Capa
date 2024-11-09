<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HighlightProductRequest extends FormRequest
{
    public function rules()
    {
        return [
            'priority' => 'sometimes|required|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'priority.required' => 'The priority field is required when provided.',
            'priority.integer' => 'The priority must be an integer.',
            'priority.min' => 'The priority must be at least 1.',
        ];
    }
}
