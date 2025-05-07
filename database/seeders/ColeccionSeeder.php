<?php

namespace Database\Seeders;

use App\Models\Coleccion;
use App\Models\Premio;
use App\Models\Rasca;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ColeccionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sergio = User::where('name', 'sergio')->first();

        $coleccion = Coleccion::create([
            'nombre' => 'Rascas Nijuuni 2025',
            'descripcion' => 'Rasca y podrás obtener una camiseta o sudadera de la marca Nijuuni. Disponible durante 2025',
            'user_id' => $sergio->id,
            'abierta' => true,
        ]);

        $this->crearRascas($coleccion);
    }

    /**
     * Crear rascas asociados a la colección
     */
    private function crearRascas(Coleccion $coleccion)
    {
        $camiseta = Premio::where('nombre', 'camiseta')->first();
        $sudadera = Premio::where('nombre', 'sudadera')->first();

        Rasca::factory()->count(2)->create();

        Rasca::create([
            'codigo' => (string) Str::uuid(),
            'coleccion_id' => $coleccion->id,
            'premio_id' => $sudadera->id,
        ]);

        Rasca::factory()->count(2)->create();

        for ($i = 0; $i < 2; $i++) {
            Rasca::create([
                'codigo' => (string) Str::uuid(),
                'coleccion_id' => $coleccion->id,
                'premio_id' => $camiseta->id,
            ]);
        }


    }
}
