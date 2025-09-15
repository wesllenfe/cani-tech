<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DonationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'donor_name' => 'required|string|max:255',
            'donor_email' => 'nullable|email',
            'date' => 'required|date'
        ];
    }

    public function messages()
    {
        return [
            'category_id.required' => 'A categoria é obrigatória.',
            'category_id.exists' => 'A categoria selecionada não existe.',
            'title.required' => 'O título é obrigatório.',
            'amount.required' => 'O valor é obrigatório.',
            'amount.numeric' => 'O valor deve ser um número.',
            'amount.min' => 'O valor deve ser maior ou igual a zero.',
            'donor_name.required' => 'O nome do doador é obrigatório.',
            'donor_email.email' => 'O email deve estar em um formato válido.',
            'date.required' => 'A data é obrigatória.',
            'date.date' => 'A data deve estar em um formato válido.'
        ];
    }
}
