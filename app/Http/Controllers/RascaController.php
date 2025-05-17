<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRascaRequest;
use App\Http\Requests\UpdateRascaRequest;
use App\Models\Rasca;
use Inertia\Inertia;

class RascaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRascaRequest $request)
    {
        //
    }

    /**
     * Mostrar rasca a partir de su codigo (uuid)
     */
    public function show(string $codigo)
    {
        $rasca = Rasca::with('coleccion')->where('codigo', $codigo)->firstOrFail();

        return Inertia::render('Rascas/Show', [
            'rasca' => [
                'codigo' => $rasca->codigo,
                'scratched_at' => $rasca->scratched_at,
                'coleccion' => [
                    'id' => $rasca->coleccion->id,
                    'nombre' => $rasca->coleccion->nombre,
                ],
            ],
        ]);
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rasca $rasca)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRascaRequest $request, Rasca $rasca)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rasca $rasca)
    {
        //
    }

    public function mostrarPublico(string $codigo)
    {
        $rasca = \App\Models\Rasca::where('codigo', $codigo)->firstOrFail();

        return Inertia::render('Rascas/Publico', [
            'rasca' => $rasca,
        ]);
    }
}
