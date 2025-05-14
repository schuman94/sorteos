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
            'nombre' => 'Camiseta Fire in the Blood',
            'valor' => 24.95,
            'link' => 'https://nijuuni.es/products/fire-in-the-blood-camiseta-regular',
            'proveedor' => 'Nijuuni',
            'descripcion' => 'Sudadera de la marca Nijuuni, el organizador del sorteo se pondrá en contacto contigo por email y podrás indicarle modelo y talla',
            'user_id' => $sergio->id,
        ]);

        Premio::create([
            'nombre' => 'Sudadera NIKA01',
            'valor' => 49.95,
            'link' => 'https://nijuuni.es/products/nika03-hoodie',
            'proveedor' => 'Nijuuni',
            'descripcion' => 'Sudadera de la marca Nijuuni, el organizador del sorteo se pondrá en contacto contigo por email y podrás indicarle modelo y talla',
            'user_id' => $sergio->id,
        ]);
    }
}
