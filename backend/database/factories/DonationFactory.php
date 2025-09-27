<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class DonationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'category_id' => Category::factory(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'amount' => fake()->randomFloat(2, 1, 1000),
            'donor_name' => fake()->name(),
            'donor_email' => fake()->safeEmail(),
            'date' => fake()->date(),
        ];
    }
}
