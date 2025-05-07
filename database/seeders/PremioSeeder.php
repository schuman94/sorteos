<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Premio;

class PremioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Premio::create([
            'nombre' => 'camiseta',
            'descripcion' => 'Sudadera de la marca Nijuuni, el organizador del sorteo se pondrá en contacto contigo por email y podrás indicarle modelo y talla',
        ]);

        Premio::create([
            'nombre' => 'sudadera',
            'descripcion' => 'Sudadera de la marca Nijuuni, el organizador del sorteo se pondrá en contacto contigo por email y podrás indicarle modelo y talla',
        ]);
    }
}
