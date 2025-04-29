<?php

namespace Database\Seeders;

use App\Models\Dominio;
use App\Models\Host;
use Illuminate\Database\Seeder;

class DominioSeeder extends Seeder
{
    public function run(): void
    {
        $youtube = Host::where('nombre', 'YouTube')->firstOrFail();
        $bluesky = Host::where('nombre', 'Bluesky')->firstOrFail();
        $instagram = Host::where('nombre', 'Instagram')->firstOrFail();

        // Dominios conocidos de YouTube
        $youtubeDominios = [
            'youtube.com',
            'www.youtube.com',
            'youtu.be',
        ];

        foreach ($youtubeDominios as $dominio) {
            Dominio::create([
                'nombre' => $dominio,
                'host_id' => $youtube->id,
            ]);
        }

        // Dominios conocidos de Bluesky
        $blueskyDominios = [
            'bsky.app',
        ];

        foreach ($blueskyDominios as $dominio) {
            Dominio::create([
                'nombre' => $dominio,
                'host_id' => $bluesky->id,
            ]);
        }

        // Dominios conocidos de Instagram
        $instagramDominios = [
            'instagram.com',
            'www.instagram.com',
        ];

        foreach ($instagramDominios as $dominio) {
            Dominio::create([
                'nombre' => $dominio,
                'host_id' => $instagram->id,
            ]);
        }
    }
}
