<?php

namespace Database\Seeders;

use App\Models\Ganador;
use App\Models\Sorteo;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SorteoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sergio = User::where('name', 'sergio')->first();

        Sorteo::factory()
            ->count(20)
            ->create(['user_id' => $sergio->id])
            ->each(function ($sorteo) {
                Ganador::factory()->create([
                    'sorteo_id' => $sorteo->id,
                    'posicion' => 1,
                ]);
            });
    }
}
