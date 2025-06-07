<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Premio>
 */
class PremioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $imagenes = [
            'https://sorteillo.s3.eu-north-1.amazonaws.com/public/premios/4HZfpwMA0QPkqwPlhAX7P8d03bGttRJlYtiKwRHG.webp',
            'https://sorteillo.s3.eu-north-1.amazonaws.com/public/premios/FxaAE0YkJgaPCcAQt0VBXhcmIGiLjArpsA7ruL4Z.png',
            'https://sorteillo.s3.eu-north-1.amazonaws.com/public/premios/p1nxs3i3nyhfNatqCgohDFRs4Q032BfIP7tZ1iYM.png',
        ];

        $thumbnails = [
            'https://sorteillo.s3.eu-north-1.amazonaws.com/public/thumbs/683f08287272c.jpg',
            'https://sorteillo.s3.eu-north-1.amazonaws.com/public/thumbs/6838738ab79d2.jpg',
            'https://sorteillo.s3.eu-north-1.amazonaws.com/public/thumbs/68387406a79f4.jpg',
        ];

        return [
            'nombre' => fake()->words(2, true),
            'valor' => fake()->randomFloat(2, 5, 500),
            'proveedor' => fake()->company(),
            'descripcion' => fake()->sentence(),
            'link' => fake()->url(),
            'imagen_url' => fake()->randomElement($imagenes),
            'thumbnail_url' => fake()->randomElement($thumbnails),
            'created_at' => fake()->dateTimeBetween('-5 years', 'now'),
            'updated_at' => now(),
        ];
    }
}
