<?php

namespace Database\Seeders;

use App\Models\Clasificacion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClasificacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Clasificacion::create([
            'nombre' => 'titular',
        ]);

        Clasificacion::create([
            'nombre' => 'suplente',
        ]);
    }
}
