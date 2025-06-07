<?php

namespace Database\Seeders;

use App\Models\Coleccion;
use App\Models\Premio;
use App\Models\Rasca;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use InvalidArgumentException;


class ColeccionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sergio = User::where('name', 'sergio')->first();

        $coleccion1 = Coleccion::create([
            'nombre' => 'Rascas Friking 100% Premio',
            'descripcion' => 'Rasca y podrás obtener una camiseta de la marca Friking.',
            'user_id' => $sergio->id,
            'abierta' => true,
        ]);

        $coleccion2 = Coleccion::create([
            'nombre' => 'Rascas Friking 1% Premio',
            'descripcion' => 'Rasca y podrás obtener una camiseta de la marca Friking.',
            'user_id' => $sergio->id,
            'abierta' => true,
        ]);

        $coleccion3 = Coleccion::create([
            'nombre' => '2 Rascas Friking ',
            'descripcion' => 'Rasca y podrás obtener una camiseta de la marca Friking.',
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

        $this->crearRascas($coleccion1, 100, 100);
        $this->crearRascas($coleccion2, 100, 5);
        $this->crearRascas($coleccion3, 2, 1);
        $this->crearRascas($coleccion4, 10, 1);
        $this->crearRascas($coleccion5, 10, 1);
    }

    /**
     * Crear rascas asociados a la colección
     */
    private function crearRascas(Coleccion $coleccion, int $total, int $premiados)
    {
        if ($premiados > $total) {
            throw new InvalidArgumentException('El número de rascas premiados no puede ser mayor que el total.');
        }

        $camisetaLight = Premio::find(1);
        $camisetaRamen = Premio::find(2);

        if (!$camisetaLight || !$camisetaRamen) {
            throw new InvalidArgumentException('Los premios requeridos no existen en la base de datos.');
        }

        $premios = [$camisetaLight, $camisetaRamen];

        // Crear rascas premiados
        for ($i = 0; $i < $premiados; $i++) {
            Rasca::create([
                'codigo' => (string) Str::uuid(),
                'coleccion_id' => $coleccion->id,
                'premio_id' => fake()->randomElement($premios)->id,
            ]);
        }

        // Crear rascas sin premio
        $sinPremio = $total - $premiados;
        Rasca::factory()->count($sinPremio)->create([
            'coleccion_id' => $coleccion->id,
            'premio_id' => null,
        ]);
    }
}
