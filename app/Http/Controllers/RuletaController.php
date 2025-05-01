<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRuletaRequest;
use App\Http\Requests\UpdateRuletaRequest;
use App\Models\Sorteo;
use Illuminate\Support\Facades\DB;
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
        $nombres = '';

        if ($sorteoId) {
            $sorteo = Sorteo::with(['ganadores', 'ganadores.comentario'])
                ->where('id', $sorteoId)
                ->where('user_id', Auth::id()) // Solo el dueño puede usarlo
                ->firstOrFail();

                $nombres = collect($sorteo->ganadores)
                ->where('esSuplente', false)
                ->map(function ($ganador) {
                    return $ganador->nombre_manual ?? ($ganador->comentario->autor ?? null);
                })
                ->filter()
                ->implode("\n");
        }

        return Inertia::render('Ruleta/Ruleta', [
            'user' => Auth::user(),
            'nombresPrecargados' => $nombres,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:ruletas,nombre,NULL,id,user_id,' . Auth::id(),
            'entradas' => 'required|array|min:1',
            'entradas.*' => 'string|max:255',
        ]);

        $ruleta = new Ruleta();
        $ruleta->nombre = $request->nombre;
        $ruleta->entradas = json_encode($request->entradas);
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
            'entradas' => 'required|array|min:1',
            'entradas.*' => 'string|max:255',
        ]);

        $ruleta->nombre = $request->nombre;
        $ruleta->entradas = json_encode($request->entradas);
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
