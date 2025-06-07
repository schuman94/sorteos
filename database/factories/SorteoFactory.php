<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sorteo>
 */
class SorteoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => null, // se asigna desde el seeder
            'publicacion_id' => null, // sorteo manual
            'num_participantes' => fake()->numberBetween(5, 20),
            'nombre' => fake()->sentence(3),
            'codigo_certificado' => Str::upper(Str::random(7)),
            'created_at' => fake()->dateTimeBetween('-3 years', 'now'),
            'updated_at' => now(),
        ];
    }
}
