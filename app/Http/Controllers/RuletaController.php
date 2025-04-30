<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRuletaRequest;
use App\Http\Requests\UpdateRuletaRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Ruleta;
use Inertia\Inertia;

class RuletaController extends Controller
{
    public function inicio()
    {
        return Inertia::render('Ruleta/Ruleta', [
            'user' => Auth::user(),
        ]);
    }

    /**
     * Display a listing of the resource.
     */
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
        //
    }
}
