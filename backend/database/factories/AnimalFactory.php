<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AnimalFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'breed' => fake()->word(),
            'age_months' => fake()->numberBetween(1, 120),
            'gender' => fake()->randomElement(['male', 'female']),
            'size' => fake()->randomElement(['small', 'medium', 'large', 'extra_large']),
            'color' => fake()->colorName(),
            'description' => fake()->sentence(),
            'status' => 'available',
            'vaccinated' => fake()->boolean(),
            'neutered' => fake()->boolean(),
            'entry_date' => fake()->date(),
        ];
    }
}
