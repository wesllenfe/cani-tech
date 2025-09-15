<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:expense,donation'
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'O nome da categoria é obrigatório.',
            'type.required' => 'O tipo da categoria é obrigatório.',
            'type.in' => 'O tipo deve ser "expense" ou "donation".'
        ];
    }
}
