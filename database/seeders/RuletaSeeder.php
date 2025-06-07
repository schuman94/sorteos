<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ruleta;
use App\Models\User;

class RuletaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sergio = User::where('name', 'sergio')->first();

        Ruleta::create([
            'nombre' => 'Regalar subs',
            'user_id' => $sergio->id,
            'opciones' => json_encode([
                'Regalar 100 subs',
                'Regalar 50 subs',
                'Regalar 20 subs',
                'Regalar 1 sub',
                'Nada',
            ]),
        ]);


        Ruleta::create([
            'nombre' => 'Desafios',
            'user_id' => $sergio->id,
            'opciones' => json_encode([
                'Sortear premio',
                'Regalar 50 subs',
                'Hacer 10 flexiones',
                'Chupito',
                'Nada',
                'Cerrar streaming',
            ]),
        ]);

        Ruleta::create([
            'nombre' => 'A qué jugamos hoy',
            'user_id' => $sergio->id,
            'opciones' => json_encode([
                'Fortnite',
                'Valorant',
                'Counter Strike',
                'Among Us',
                'Nada',
                'Red Dead Redemption',
                'Dragon Ball',
            ]),
        ]);

        Ruleta::factory()->count(10)->create([
            'user_id' => $sergio->id,
        ]);
    }
}
