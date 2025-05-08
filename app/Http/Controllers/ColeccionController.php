<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreColeccionRequest;
use App\Http\Requests\UpdateColeccionRequest;
use App\Models\Coleccion;
use App\Models\Rasca;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class ColeccionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $colecciones = Auth::user()
            ->colecciones()
            ->latest()
            ->get();

        return Inertia::render('Coleccion/Index', [
            'colecciones' => $colecciones,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Coleccion/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'numeroRascas' => 'required|integer|min:1',
            'premios' => 'required|array',
            'premios.*.premio_id' => 'required|exists:premios,id',
            'premios.*.cantidad' => 'required|integer|min:1',
        ]);


        $coleccion = new Coleccion();
        $coleccion->nombre = $validatedData['nombre'];
        $coleccion->descripcion = $validatedData['descripcion'];
        $coleccion->user()->associate(Auth::user());
        $coleccion->save();

        $this->CrearRascas($coleccion, $validatedData['numeroRascas'], $validatedData['premios']);

        return Inertia::location(route('colecciones.show', $coleccion));
    }


    public function crearRascas(Coleccion $coleccion, $numRascas, $premios)
    {
        $premiosSecuenciales = [];
        foreach ($premios as $premio) {
            $premiosSecuenciales = array_merge($premiosSecuenciales, array_fill(0, $premio['cantidad'], $premio['premio_id']));
        }

        $rascas = [];
        for ($i = 0; $i < $numRascas; $i++) {
            $rasca = new Rasca();
            $rasca->coleccion_id = $coleccion->id;
            $rasca->codigo = Str::uuid();
            $rasca->save();

            if (!empty($premiosSecuenciales)) {
                $premioId = array_pop($premiosSecuenciales);
                $rasca->premio_id = $premioId;
                $rasca->save();
            }

            $rascas[] = $rasca;
        }

        return $rascas;
    }


    /**
     * Display the specified resource.
     */
    public function show(Coleccion $coleccion)
    {
        return Inertia::render('Coleccion/Show', [
            'coleccion' => $coleccion,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Coleccion $coleccion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateColeccionRequest $request, Coleccion $coleccion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coleccion $coleccion)
    {
        //
    }
}
