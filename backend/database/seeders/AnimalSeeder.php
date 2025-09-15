<?php

namespace Database\Seeders;

use App\Models\Animal;
use Illuminate\Database\Seeder;

class AnimalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $animals = [
            [
                'name' => 'Thor',
                'breed' => 'Pastor Alemão',
                'age_months' => 24,
                'gender' => 'male',
                'size' => 'large',
                'color' => 'Marrom e preto',
                'description' => 'Thor é um cão muito carinhoso e protetor. Adora brincar e é ótimo com crianças.',
                'status' => 'available',
                'vaccinated' => true,
                'neutered' => true,
                'medical_notes' => 'Todas as vacinas em dia. Vermifugado recentemente.',
                'photo_url' => 'https://static.vecteezy.com/ti/fotos-gratis/t1/5857332-engracado-retrato-de-fofo-corgi-cao-ao-ar-livre-gratis-foto.jpg',
                'weight' => 32.50,
                'entry_date' => '2024-08-15',
                'adopted_by' => null,
                'adopted_at' => null,
            ],
            [
                'name' => 'Luna',
                'breed' => 'SRD',
                'age_months' => 8,
                'gender' => 'female',
                'size' => 'medium',
                'color' => 'Caramelo',
                'description' => 'Luna é uma gatinha muito dócil e brincalhona. Ama carinho e ronrona muito.',
                'status' => 'adopted',
                'vaccinated' => true,
                'neutered' => false,
                'medical_notes' => 'Castração agendada para próximo mês.',
                'photo_url' => 'https://static.vecteezy.com/ti/fotos-gratis/t1/5857332-engracado-retrato-de-fofo-corgi-cao-ao-ar-livre-gratis-foto.jpg',
                'weight' => 4.20,
                'entry_date' => '2024-07-10',
                'adopted_by' => 3, // Pedro Oliveira
                'adopted_at' => '2024-09-01 14:30:00',
            ],
            [
                'name' => 'Bolinha',
                'breed' => 'Poodle',
                'age_months' => 36,
                'gender' => 'male',
                'size' => 'small',
                'color' => 'Branco',
                'description' => 'Bolinha é muito inteligente e obediente. Ideal para apartamentos.',
                'status' => 'under_treatment',
                'vaccinated' => true,
                'neutered' => true,
                'medical_notes' => 'Em tratamento para dermatite. Previsão de alta em 2 semanas.',
                'photo_url' => 'https://static.vecteezy.com/ti/fotos-gratis/t1/5857332-engracado-retrato-de-fofo-corgi-cao-ao-ar-livre-gratis-foto.jpg',
                'weight' => 8.80,
                'entry_date' => '2024-09-05',
                'adopted_by' => null,
                'adopted_at' => null,
            ],
            [
                'name' => 'Mia',
                'breed' => 'Siamês',
                'age_months' => 18,
                'gender' => 'female',
                'size' => 'small',
                'color' => 'Cinza e branco',
                'description' => 'Mia é independente mas carinhosa. Gosta de lugares altos e é muito curiosa.',
                'status' => 'available',
                'vaccinated' => true,
                'neutered' => true,
                'medical_notes' => null,
                'photo_url' => 'https://static.vecteezy.com/ti/fotos-gratis/t1/5857332-engracado-retrato-de-fofo-corgi-cao-ao-ar-livre-gratis-foto.jpg',
                'weight' => 3.50,
                'entry_date' => '2024-08-20',
                'adopted_by' => null,
                'adopted_at' => null,
            ],
            [
                'name' => 'Rex',
                'breed' => 'Rottweiler',
                'age_months' => 60,
                'gender' => 'male',
                'size' => 'extra_large',
                'color' => 'Preto e marrom',
                'description' => 'Rex é um cão mais velho, muito calmo e leal. Procura uma família paciente.',
                'status' => 'adopted',
                'vaccinated' => true,
                'neutered' => true,
                'medical_notes' => 'Acompanhamento veterinário regular devido à idade.',
                'photo_url' => 'https://static.vecteezy.com/ti/fotos-gratis/t1/5857332-engracado-retrato-de-fofo-corgi-cao-ao-ar-livre-gratis-foto.jpg',
                'weight' => 45.00,
                'entry_date' => '2024-06-01',
                'adopted_by' => 5, // Carlos Ferreira
                'adopted_at' => '2024-08-25 10:15:00',
            ],
        ];

        foreach ($animals as $animalData) {
            Animal::create($animalData);
        }
    }
}
