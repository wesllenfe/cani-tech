<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = new User();
        $admin->name = 'Administrador';
        $admin->email = env('ADMIN_EMAIL');
        $admin->cpf = '00000000000';
        $admin->birth_date = '1990-01-01';
        $admin->password = Hash::make(env('ADMIN_PASSWORD'));
        $admin->role = 'admin';
        $admin->save();

        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            AnimalSeeder::class,
            ExpenseSeeder::class,
            DonationSeeder::class,
        ]);
    }
}
