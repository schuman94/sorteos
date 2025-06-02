<?php

use App\Models\User;
use App\Models\Sorteo;

test('un usuario autenticado puede iniciar un sorteo manual', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('sorteo.manual.iniciar'), [
            'nombre' => 'Sorteo de prueba',
            'num_ganadores' => 2,
            'num_suplentes' => 1,
            'participantes' => "Juan\nPedro\nLucía\nAna",
            'eliminar_duplicados' => true,
            'cuenta_regresiva' => 5,
        ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'ganadores',
        'urlHost',
    ]);

    $this->assertDatabaseHas('sorteos', [
        'nombre' => 'Sorteo de prueba',
        'user_id' => $user->id,
        'num_participantes' => 4,
    ]);

    $sorteo = Sorteo::where('nombre', 'Sorteo de prueba')->first();
    expect($sorteo->ganadores)->toHaveCount(3); // 2 ganadores + 1 suplente
});
