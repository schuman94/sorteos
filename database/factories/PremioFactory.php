<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Premio>
 */
class PremioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => fake()->words(2, true),
            'valor' => fake()->randomFloat(2, 5, 500),
            'proveedor' => fake()->company(),
            'descripcion' => fake()->sentence(),
            'link' => fake()->url(),
        ];
    }
}
