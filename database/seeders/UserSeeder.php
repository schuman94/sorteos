<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear un usuario admin
        User::create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('adminadmin'),
            'role' => 'admin'
        ]);

        // Crea un usuario un usuario normal
        User::create([
            'name' => 'sergio',
            'email' => 'sergio@sergio.com',
            'password' => Hash::make('sergiosergio'),
            'role' => 'user'
        ]);
    }
}
