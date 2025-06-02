<?php

use App\Models\User;
use App\Models\Premio;
use App\Models\Coleccion;
use App\Models\Rasca;
use Illuminate\Support\Facades\Mail;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

test('un usuario autenticado puede crear una colección de rascas', function () {
    $user = User::factory()->create();
    actingAs($user);

    $premio = Premio::factory()->create([
        'user_id' => $user->id,
        'valor' => 25,
    ]);

    $response = post(route('colecciones.store'), [
        'nombre' => 'Colección test',
        'descripcion' => 'Descripción test',
        'numeroRascas' => 5,
        'premios' => [
            [
                'premio_id' => $premio->id,
                'cantidad' => 3,
            ],
        ],
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('colecciones', [
        'nombre' => 'Colección test',
        'descripcion' => 'Descripción test',
        'user_id' => $user->id,
    ]);

    $coleccion = Coleccion::where('nombre', 'Colección test')->first();
    expect($coleccion)->not()->toBeNull();
    expect($coleccion->rascas)->toHaveCount(5);

    $rascasConPremio = Rasca::where('coleccion_id', $coleccion->id)
        ->whereNotNull('premio_id')
        ->count();

    expect($rascasConPremio)->toBe(3);
});

test('un usuario puede rascar un rasca proporcionado', function () {
    Mail::fake();

    $user = User::factory()->create();
    actingAs($user);

    $coleccion = Coleccion::factory()
        ->hasRascas(5, fn() => ['provided_at' => now()])
        ->create([
            'nombre' => 'Colección de prueba',
            'descripcion' => 'Descripción de prueba',
            'user_id' => $user->id,
        ]);

    // Asegurarse de tener los rascas cargados
    $coleccion->load('rascas');

    // Asignar un premio a uno de los rascas
    $premiado = $coleccion->rascas->first();
    $premio = Premio::factory()->create(['user_id' => $user->id]);
    $premiado->update(['premio_id' => $premio->id]);

    $codigo = $premiado->codigo;

    $response = put(route('rascas.rascar', $codigo));

    $response->assertRedirect(route('rascas.show', $codigo));

    $this->assertNotNull($premiado->fresh()->scratched_at);
    $this->assertEquals($user->id, $premiado->fresh()->scratched_by);
});
