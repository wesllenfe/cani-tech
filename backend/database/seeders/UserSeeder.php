<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'João Silva',
                'email' => 'joao.silva@email.com',
                'cpf' => '12345678901',
                'birth_date' => '1985-03-15',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria.santos@email.com',
                'cpf' => '23456789012',
                'birth_date' => '1990-07-22',
                'password' => Hash::make('password123'),
                'role' => 'caregiver',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Pedro Oliveira',
                'email' => 'pedro.oliveira@email.com',
                'cpf' => '34567890123',
                'birth_date' => '1992-11-08',
                'password' => Hash::make('password123'),
                'role' => 'adopter',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Ana Costa',
                'email' => 'ana.costa@email.com',
                'cpf' => '45678901234',
                'birth_date' => '1988-01-30',
                'password' => Hash::make('password123'),
                'role' => 'caregiver',
                'email_verified_at' => null, // Email não verificado
            ],
            [
                'name' => 'Carlos Ferreira',
                'email' => 'carlos.ferreira@email.com',
                'cpf' => '56789012345',
                'birth_date' => '1995-05-12',
                'password' => Hash::make('password123'),
                'role' => 'adopter',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }
    }
}
