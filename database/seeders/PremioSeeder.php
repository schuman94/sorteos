<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Premio;
use App\Models\User;

class PremioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sergio = User::where('name', 'sergio')->first();

        Premio::create([
            'nombre' => 'camiseta',
            'user_id' => $sergio->id,
            'descripcion' => 'Sudadera de la marca Nijuuni, el organizador del sorteo se pondrá en contacto contigo por email y podrás indicarle modelo y talla',
        ]);

        Premio::create([
            'nombre' => 'sudadera',
            'user_id' => $sergio->id,
            'descripcion' => 'Sudadera de la marca Nijuuni, el organizador del sorteo se pondrá en contacto contigo por email y podrás indicarle modelo y talla',
        ]);
    }
}
