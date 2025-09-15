<?php

namespace Database\Seeders;

use App\Models\Donation;
use Illuminate\Database\Seeder;

class DonationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $donations = [
            [
                'category_id' => 3, // Doação em Dinheiro
                'title' => 'Doação Mensal - Empresa XYZ',
                'description' => 'Doação mensal da empresa XYZ para manutenção dos animais',
                'amount' => 500.00,
                'donor_name' => 'Empresa XYZ Ltda',
                'donor_email' => 'contato@empresaxyz.com.br',
                'date' => '2024-09-01',
            ],
            [
                'category_id' => 5, // Doação de Ração
                'title' => 'Doação de Ração Premium',
                'description' => 'Doação de 50kg de ração premium para cães adultos',
                'amount' => 300.00,
                'donor_name' => 'Pet Shop Amigo Fiel',
                'donor_email' => 'doacoes@petshopamigofiel.com',
                'date' => '2024-09-05',
            ],
            [
                'category_id' => 3, // Doação em Dinheiro
                'title' => 'Doação Espontânea',
                'description' => 'Doação de pessoa física sensibilizada pela causa animal',
                'amount' => 75.00,
                'donor_name' => 'Maria Aparecida Silva',
                'donor_email' => 'maria.aparecida@gmail.com',
                'date' => '2024-09-08',
            ],
            [
                'category_id' => 3, // Doação em Dinheiro
                'title' => 'Campanha de Arrecadação',
                'description' => 'Valor arrecadado em campanha online para cirurgias',
                'amount' => 850.00,
                'donor_name' => 'Campanha Online - Vários Doadores',
                'donor_email' => null,
                'date' => '2024-09-10',
            ],
            [
                'category_id' => 5, // Doação de Ração
                'title' => 'Doação de Petiscos e Brinquedos',
                'description' => 'Doação de petiscos, brinquedos e acessórios para os animais',
                'amount' => 120.00,
                'donor_name' => 'Família Santos',
                'donor_email' => 'familia.santos@outlook.com',
                'date' => '2024-09-12',
            ],
        ];

        foreach ($donations as $donationData) {
            Donation::create($donationData);
        }
    }
}
