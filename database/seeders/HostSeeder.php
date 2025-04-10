<?php

namespace Database\Seeders;

use App\Models\Host;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Host::create([
            'nombre' => 'YouTube',
            'url' => 'https://www.youtube.com'
        ]);

        Host::create([
            'nombre' => 'Instagram',
            'url' => 'https://www.instagram.com'
        ]);
    }
}
