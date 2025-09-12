<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateAdminUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'cpf' => 'required|string|size:11|unique:users',
            'birth_date' => 'required|date|before:today',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['admin', 'caregiver', 'adopter'])],
        ];
    }

    public function failedAuthorization()
    {
        throw new \Illuminate\Auth\Access\AuthorizationException(
            'Apenas administradores podem criar usuários com privilégios especiais.'
        );
    }
}
