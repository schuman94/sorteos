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

        $coleccion1 = Coleccion::create([
            'nombre' => 'Rascas Nijuuni 2025',
            'descripcion' => 'Rasca y podrás obtener una camiseta o sudadera de la marca Nijuuni. Disponible durante 2025',
            'user_id' => $sergio->id,
            'abierta' => true,
        ]);

        $coleccion2 = Coleccion::create([
            'nombre' => 'Rascas Camisetas',
            'descripcion' => 'Rasca y podrás obtener una camiseta o sudadera.',
            'user_id' => $sergio->id,
            'abierta' => true,
        ]);

        $coleccion3 = Coleccion::create([
            'nombre' => 'Rascas Camisetas y sudaderas',
            'descripcion' => 'Rasca y podrás obtener una camiseta o sudadera.',
            'user_id' => $sergio->id,
            'abierta' => true,
        ]);

        $coleccion4 = Coleccion::create([
            'nombre' => 'Rascas Coleccion 4',
            'descripcion' => 'Descripcion de la coleccion de rascas 4.',
            'user_id' => $sergio->id,
            'abierta' => true,
        ]);

        $coleccion5 = Coleccion::create([
            'nombre' => 'Rascas Coleccion 5',
            'descripcion' => 'Descripcion de la coleccion de rascas 5.',
            'user_id' => $sergio->id,
            'abierta' => true,
        ]);

        $this->crearRascas($coleccion1);
        $this->crearRascas($coleccion2);
        $this->crearRascas($coleccion3);
        $this->crearRascas($coleccion4);
        $this->crearRascas($coleccion5);
    }

    /**
     * Crear rascas asociados a la colección
     */
    private function crearRascas(Coleccion $coleccion)
    {
        $camiseta = Premio::find(1);
        $sudadera = Premio::find(2);

        Rasca::factory()->count(2)->create([
            'coleccion_id' => $coleccion->id,
        ]);

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
