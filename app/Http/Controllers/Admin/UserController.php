<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Obtenemos todos los usuarios con conteo de sorteos
        $users = User::withCount('sorteos')->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function show(User $user)
    {
        $user->load('sorteos.publicacion.host');

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'sorteos' => $user->sorteos->map(function ($sorteo) {
                    return [
                        'id' => $sorteo->id,
                        'url' => $sorteo->publicacion?->url,
                        'titulo' => $sorteo->publicacion?->titulo,
                        'tipo' => $sorteo->publicacion?->host?->nombre ?? 'Manual',
                        'num_participantes' => $sorteo->num_participantes,
                        'created_at' => $sorteo->created_at->toDateTimeString(),
                    ];
                }),
            ]
        ]);
    }
}
