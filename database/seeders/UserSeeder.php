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
        User::create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('adminadmin'),
            'is_admin' => true,
        ]);

        User::create([
            'name' => 'admin2',
            'email' => 'admin2@admin2.com',
            'password' => Hash::make('admin2admin2'),
            'is_admin' => true,
        ]);


        User::create([
            'name' => 'sergio',
            'email' => 'sergio@sergio.com',
            'password' => Hash::make('sergiosergio'),
            'is_admin' => false,
        ]);

        // Usuarios aleatorios con contraseña 'password'
        User::factory()->count(20)->create([
            'password' => Hash::make('password'),
            'is_admin' => false,
        ]);
    }
}
