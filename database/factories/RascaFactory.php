<?php

namespace Database\Factories;

use App\Models\Coleccion;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Rasca>
 */
class RascaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $coleccion = Coleccion::where('nombre', 'Rascas Nijuuni 2025')->first();
        return [
            'codigo' => (string) Str::uuid(),
            'coleccion_id' => $coleccion->id,
        ];
    }
}
