<?php

namespace App\Http\Controllers;

use App\Models\Sorteo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use App\Models\Ruleta;
use Inertia\Inertia;

class RuletaController extends Controller
{
    public function inicio(Request $request)
    {
        $sorteoId = $request->query('sorteo');
        $opciones = collect(); // Inicializamos como colección vacía

        if ($sorteoId) {
            $sorteo = Sorteo::with(['ganadores', 'ganadores.comentario'])
                ->where('id', $sorteoId)
                ->where('user_id', Auth::id()) // Solo el dueño puede usarlo
                ->firstOrFail();

            $opciones = $sorteo->ganadores
                ->where('esSuplente', false)
                ->map(function ($ganador) {
                    return $ganador->comentario?->autor ?? $ganador->nombre_manual; // Si el ganador no tiene comentario, se devuelve nombre_manual
                })
                ->filter() // Elimina valores null (por si acaso)
                ->values(); // Resetea los índices

        }

        return Inertia::render('Ruleta/Ruleta', [
            'opcionesPrecargadas' => $opciones->toJson(),
            // Se envia como una string JSON para que tenga el mismo formato que la columna "opciones" de la tabla ruletas
            // Si está vacia devuelve "[]"
        ]);
    }

    public function index()
    {
        $ruletas = Auth::user()
            ->ruletas()
            ->latest()
            ->get();

        return response()->json($ruletas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:ruletas,nombre,NULL,id,user_id,' . Auth::id(),
            'opciones' => 'required|array|min:1',
            'opciones.*' => 'string|max:255',
        ], [
            'nombre.unique' => 'Ya existe una ruleta con ese nombre.',
            'nombre.required' => 'Debes introducir un nombre',
        ]
    );

        $ruleta = new Ruleta();
        $ruleta->nombre = $request->nombre;
        $ruleta->opciones = json_encode($request->opciones); // Se convierte en un json string
        $ruleta->user()->associate(Auth::user());
        $ruleta->save();

        return response()->json(['message' => 'Ruleta guardada correctamente', 'ruleta' => $ruleta]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ruleta $ruleta)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ruleta $ruleta)
    {
        Gate::authorize('update', $ruleta);

        $request->validate([
            'nombre' => 'required|string|max:255|unique:ruletas,nombre,' . $ruleta->id . ',id,user_id,' . Auth::id(),
            'opciones' => 'required|array|min:1',
            'opciones.*' => 'string|max:255',
        ], [
            'nombre.unique' => 'Ya existe otra ruleta con ese nombre',
            'nombre.required' => 'Debes introducir un nombre.',
        ]);

        $ruleta->nombre = $request->nombre;
        $ruleta->opciones = json_encode($request->opciones);
        $ruleta->save();

        return response()->json(['message' => 'Ruleta actualizada correctamente', 'ruleta' => $ruleta]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ruleta $ruleta)
    {
        Gate::authorize('delete', $ruleta);

        $ruleta->delete();

        return response()->json([
            'message' => 'Ruleta eliminada correctamente',
        ]);
    }
}
