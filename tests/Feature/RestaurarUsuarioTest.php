<?php

use App\Models\User;

test('un administrador puede restaurar un usuario eliminado', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $this->actingAs($admin);

    $usuario = User::factory()->create();
    $usuario->delete();

    $this->assertSoftDeleted($usuario);

    $response = $this->post(route('admin.users.restaurar', $usuario->id));

    $response->assertRedirect(route('admin.users.show', $usuario->id));

    $this->assertDatabaseHas('users', [
        'id' => $usuario->id,
        'deleted_at' => null,
    ]);
});
