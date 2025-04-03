<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSorteoRequest;
use App\Http\Requests\UpdateSorteoRequest;
use Illuminate\Http\Request;
use App\Models\Sorteo;

class SorteoController extends Controller
{
    public function iniciar(Request $request)
    {
        /*
        $request->validate([
            'url' => 'required|url',
            'num_ganadores' => 'required|integer|min:1',
            'num_suplentes' => 'required|integer|min:0',
            'permitir_comentarios_duplicados' => 'boolean',
            'permitir_autores_duplicados' => 'boolean',
            'hashtag' => 'nullable|string',
            'mencion' => 'boolean',
            'participantes_extra' => 'nullable|string',
            'excluir_usuarios' => 'nullable|string',
        ]);
        */

        // Aquí va la lógica del sorteo y la creación en la base de datos...
        // ...

        // Por ahora simulamos una respuesta de ejemplo:
        $ganadores = [
            ['nombre' => 'Pepe', 'clasificacion' => 'titular', 'posicion' => 1],
            ['nombre' => 'Ana', 'clasificacion' => 'titular', 'posicion' => 2],
            ['nombre' => 'Enrique', 'clasificacion' => 'titular', 'posicion' => 3],
            ['nombre' => 'Sergio', 'clasificacion' => 'suplente', 'posicion' => 1],
            ['nombre' => 'Manuel', 'clasificacion' => 'suplente', 'posicion' => 2],
        ];

        return response()->json([
            'ganadores' => $ganadores,
        ]);
    }
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
    public function store(StoreSorteoRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Sorteo $sorteo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sorteo $sorteo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSorteoRequest $request, Sorteo $sorteo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sorteo $sorteo)
    {
        //
    }
}
