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
            'nombre' => 'Camiseta Pirate Light',
            'valor' => 10,
            'link' => 'https://www.friking.es/products/camisetas-manga-corta-hombre-pirate-light',
            'proveedor' => 'Friking',
            'descripcion' => 'Camiseta de hombre de manga corta Pirate Light de cuello redondo con las costuras reforzadas en la parte de los hombros y el cuello.',
            'user_id' => $sergio->id,
            'imagen_url' => 'https://sorteillo.s3.eu-north-1.amazonaws.com/public/premios/p1nxs3i3nyhfNatqCgohDFRs4Q032BfIP7tZ1iYM.png',
            'thumbnail_url' => 'https://sorteillo.s3.eu-north-1.amazonaws.com/public/thumbs/68387406a79f4.jpg',
        ]);

        Premio::create([
            'nombre' => 'Camiseta Pirate Ramen',
            'valor' => 10,
            'link' => 'https://www.friking.es/products/camisetas-manga-corta-hombre-pirate-ramen',
            'proveedor' => 'Friking',
            'descripcion' => 'Camiseta de hombre de manga corta Pirate Ramen de cuello redondo con las costuras reforzadas en la parte de los hombros y el cuello.',
            'user_id' => $sergio->id,
            'imagen_url' => 'https://sorteillo.s3.eu-north-1.amazonaws.com/public/premios/FxaAE0YkJgaPCcAQt0VBXhcmIGiLjArpsA7ruL4Z.png',
            'thumbnail_url' => 'https://sorteillo.s3.eu-north-1.amazonaws.com/public/thumbs/6838738ab79d2.jpg',
        ]);

        Premio::factory()
            ->count(38)
            ->create([
                'user_id' => $sergio->id,
            ]);
    }
}
