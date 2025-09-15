<?php

namespace Database\Seeders;

use App\Models\Expense;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $expenses = [
            [
                'category_id' => 1, // Alimentação
                'title' => 'Ração Premium 15kg',
                'description' => 'Compra de ração premium para cães adultos de grande porte',
                'amount' => 150.00,
                'date' => '2024-09-10',
                'created_by' => 1, // João Silva (admin)
            ],
            [
                'category_id' => 2, // Veterinário
                'title' => 'Consulta Thor',
                'description' => 'Consulta veterinária de rotina para Thor - exames gerais',
                'amount' => 120.00,
                'date' => '2024-09-08',
                'created_by' => 2, // Maria Santos (caregiver)
            ],
            [
                'category_id' => 4, // Medicamentos
                'title' => 'Vacinas V10',
                'description' => 'Compra de vacinas V10 para imunização dos filhotes',
                'amount' => 280.00,
                'date' => '2024-09-05',
                'created_by' => 1, // João Silva (admin)
            ],
            [
                'category_id' => 1, // Alimentação
                'title' => 'Petiscos Variados',
                'description' => 'Petiscos para treinamento e recompensa dos animais',
                'amount' => 45.50,
                'date' => '2024-09-12',
                'created_by' => 4, // Ana Costa (caregiver)
            ],
            [
                'category_id' => 2, // Veterinário
                'title' => 'Castração Bolinha',
                'description' => 'Procedimento cirúrgico de castração do Bolinha',
                'amount' => 350.00,
                'date' => '2024-09-01',
                'created_by' => 2, // Maria Santos (caregiver)
            ],
        ];

        foreach ($expenses as $expenseData) {
            Expense::create($expenseData);
        }
    }
}
