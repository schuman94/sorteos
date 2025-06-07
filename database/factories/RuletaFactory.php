<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ruleta>
 */
class RuletaFactory extends Factory
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
            'user_id' => null, // se asigna en el seeder
            'opciones' => json_encode(
                collect(range(1, 5))->map(fn() => fake()->words(2, true))->toArray()
            ),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
