<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Sorteo;
use App\Models\Host;


class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->withCount('sorteos');

        // Filtro por nombre
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filtro por email
        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        // Ordenación
        switch ($request->get('orden')) {
            case 'sorteos':
                $query->orderByDesc('sorteos_count');
                break;
            case 'fecha_asc':
                $query->orderBy('created_at');
                break;
            case 'fecha_desc':
                $query->orderByDesc('created_at');
                break;
            default:
                $query->orderBy('id');
                break;
        }

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'email', 'orden']),
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

    public function historial(Request $request, User $user)
{
    $query = $user->sorteos()->with('publicacion.host');

    // Filtro por año
    if ($request->filled('anyo')) {
        $query->whereYear('created_at', $request->anyo);
    } else {
        $anyoMasReciente = $user->sorteos()
            ->selectRaw('EXTRACT(YEAR FROM created_at) as anyo')
            ->orderByDesc('anyo')
            ->limit(1)
            ->value('anyo');
        $request->merge(['anyo' => $anyoMasReciente]);
        $query->whereYear('created_at', $anyoMasReciente);
    }

    // Filtro por host
    if ($request->filled('tipo')) {
        if ($request->tipo === 'manual') {
            $query->whereNull('publicacion_id');
        } else {
            $query->whereHas('publicacion', function ($q) use ($request) {
                $q->where('host_id', $request->tipo);
            });
        }
    }

    $sorteos = $query->orderByDesc('created_at')->get()->map(function ($sorteo) {
        return [
            'id' => $sorteo->id,
            'url' => $sorteo->publicacion?->url,
            'titulo' => $sorteo->publicacion?->titulo,
            'tipo' => $sorteo->publicacion?->host?->nombre ?? 'Manual',
            'num_participantes' => $sorteo->num_participantes,
            'created_at' => $sorteo->created_at->toDateTimeString(),
        ];
    });

    $anyos = $user->sorteos()
        ->selectRaw('EXTRACT(YEAR FROM created_at) as anyo')
        ->groupBy('anyo')
        ->orderByDesc('anyo')
        ->pluck('anyo');

    $hosts = Host::select('id', 'nombre')->get();

    return Inertia::render('Admin/Users/Historial', [
        'user' => $user,
        'sorteos' => $sorteos,
        'hosts' => $hosts,
        'anyos' => $anyos,
        'anyoSeleccionado' => $request->anyo,
        'tipoSeleccionado' => $request->tipo,
    ]);
}
}
