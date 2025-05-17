<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Sorteo;
use App\Models\Host;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->withCount('sorteos');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc');

        // Ordenaciones posibles (protección contra columnas no válidas)
        if (in_array($sort, ['id', 'name', 'email', 'created_at', 'sorteos_count', 'is_admin'])) {
            $query->orderBy($sort, $direction);
        }
        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'email', 'sort', 'direction']),
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
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
                'created_at' => $sorteo->created_at,
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

    public function hacerAdmin(User $user)
    {
        if ($user->is_admin) {
            return redirect()->back()->with('warning', 'El usuario ya es administrador.');
        }

        $user->is_admin = true;
        $user->save();

        return redirect()->route('admin.users.show', $user)->with('success', 'El usuario ahora es administrador.');
    }

    public function deshacerAdmin(User $user)
    {
        // No te puedes quitar permisos a ti mismo
        if (Auth::id() === $user->id) {
            return redirect()->back()->with('warning', 'No puedes quitarte los permisos de administrador a ti mismo.');
        }

        if (! $user->is_admin) {
            return redirect()->back()->with('warning', 'El usuario no es administrador.');
        }

        $user->is_admin = false;
        $user->save();

        return redirect()->route('admin.users.show', $user)->with('success', 'Permisos de administrador retirados.');
    }
}
