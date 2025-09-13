<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Animal;

class AnimalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'breed' => 'nullable|string|max:255',
            'age_months' => 'required|integer|min:1|max:300',
            'gender' => ['required', 'in:' . implode(',', [Animal::GENDER_MALE, Animal::GENDER_FEMALE])],
            'size' => ['required', 'in:' . implode(',', [
                    Animal::SIZE_SMALL,
                    Animal::SIZE_MEDIUM,
                    Animal::SIZE_LARGE,
                    Animal::SIZE_EXTRA_LARGE
                ])],
            'color' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => ['sometimes', 'in:' . implode(',', [
                    Animal::STATUS_AVAILABLE,
                    Animal::STATUS_ADOPTED,
                    Animal::STATUS_UNDER_TREATMENT,
                    Animal::STATUS_UNAVAILABLE
                ])],
            'vaccinated' => 'sometimes|boolean',
            'neutered' => 'sometimes|boolean',
            'medical_notes' => 'nullable|string|max:1000',
            'photo_url' => 'nullable|url|max:500',
            'weight' => 'nullable|numeric|min:0.1|max:200',
            'entry_date' => 'required|date|before_or_equal:today',
            'adopted_by' => 'sometimes|exists:users,id',
            'adopted_at' => 'sometimes|date'
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do animal é obrigatório.',
            'age_months.required' => 'A idade do animal é obrigatória.',
            'age_months.min' => 'A idade deve ser pelo menos 1 mês.',
            'age_months.max' => 'A idade não pode exceder 300 meses.',
            'gender.required' => 'O gênero do animal é obrigatório.',
            'gender.in' => 'O gênero deve ser masculino ou feminino.',
            'size.required' => 'O porte do animal é obrigatório.',
            'size.in' => 'O porte deve ser pequeno, médio, grande ou extra grande.',
            'color.required' => 'A cor do animal é obrigatória.',
            'status.in' => 'Status inválido.',
            'photo_url.url' => 'A URL da foto deve ser válida.',
            'weight.numeric' => 'O peso deve ser um número.',
            'weight.min' => 'O peso deve ser pelo menos 0.1 kg.',
            'weight.max' => 'O peso não pode exceder 200 kg.',
            'entry_date.required' => 'A data de entrada é obrigatória.',
            'entry_date.before_or_equal' => 'A data de entrada não pode ser futura.',
            'adopted_by.exists' => 'O usuário selecionado não existe.'
        ];
    }
}
