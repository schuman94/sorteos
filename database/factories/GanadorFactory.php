<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ganador>
 */
class GanadorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sorteo_id' => null, // se asigna desde el seeder
            'nombre_manual' => $this->faker->firstName(),
            'esSuplente' => false, // solo titulares en este caso
            'posicion' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
