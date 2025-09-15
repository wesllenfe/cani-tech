<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Alimentação',
                'description' => 'Gastos com ração, petiscos e suplementos para os animais',
                'type' => 'expense',
            ],
            [
                'name' => 'Veterinário',
                'description' => 'Consultas, exames, cirurgias e tratamentos médicos',
                'type' => 'expense',
            ],
            [
                'name' => 'Doação em Dinheiro',
                'description' => 'Valores monetários doados por pessoas físicas ou jurídicas',
                'type' => 'donation',
            ],
            [
                'name' => 'Medicamentos',
                'description' => 'Remédios, vacinas e produtos de higiene animal',
                'type' => 'expense',
            ],
            [
                'name' => 'Doação de Ração',
                'description' => 'Ração e alimentos doados para os animais',
                'type' => 'donation',
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }
    }
}
