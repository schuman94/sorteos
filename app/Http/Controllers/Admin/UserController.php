<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->withCount('sorteos');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'ilike', '%' . $search . '%')
                ->orWhere('email', 'ilike', '%' . $search . '%');
        }

        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc');

        // Ordenaciones posibles (protección contra columnas no válidas)
        if (in_array($sort, ['id', 'name', 'email', 'created_at', 'sorteos_count', 'is_admin'])) {
            $query->orderBy($sort, $direction);
        }
        $users = $query->paginate(20)->withQueryString();

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

    public function destroy(User $user)
    {
        if ($user->is_admin) {
            return redirect()->back()->with('error', 'Un administrador no puede ser eliminado.');
        }

        // Previene que un admin se elimine a sí mismo
        if (Auth::id() === $user->id) {
            return redirect()->back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'Usuario eliminado correctamente.');
    }

    public function eliminados(Request $request)
    {
        $query = User::onlyTrashed()->withCount('sorteos');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', '%' . $search . '%')
                    ->orWhere('email', 'ilike', '%' . $search . '%');
            });
        }

        $sort = $request->input('sort', 'id');
        $direction = $request->input('direction', 'asc');

        if (in_array($sort, ['id', 'name', 'email', 'created_at', 'sorteos_count', 'is_admin'])) {
            $query->orderBy($sort, $direction);
        }

        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users/Eliminados', [
            'users' => $users,
            'filters' => $request->only(['search', 'email', 'sort', 'direction']),
        ]);
    }

    public function restaurar($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        return redirect()->route('admin.users.show', $user)->with('success', 'Usuario restaurado correctamente.');
    }
}
