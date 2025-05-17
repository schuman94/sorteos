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
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

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

        $totalPremios = collect($validatedData['premios'])->sum('cantidad');

        if ($totalPremios > $validatedData['numeroRascas']) {
            return back()->withErrors([
                'premios' => 'La cantidad total de premios no puede superar el número de rascas (' . $validatedData['numeroRascas'] . ').',
            ])->withInput();
        }

        try {
            $coleccion = null;

            DB::transaction(function () use ($validatedData, &$coleccion) {
                $coleccion = new \App\Models\Coleccion();
                $coleccion->nombre = $validatedData['nombre'];
                $coleccion->descripcion = $validatedData['descripcion'];
                $coleccion->user()->associate(Auth::user());
                $coleccion->save();

                $this->CrearRascas($coleccion, $validatedData['numeroRascas'], $validatedData['premios']);
            });
            return Inertia::location(route('colecciones.show', $coleccion));
        } catch (\Throwable $e) {
            // Loguear si es necesario: Log::error($e);
            return back()->withErrors([
                'general' => 'Ocurrió un error al crear la colección. Intenta de nuevo.',
            ])->withInput();
        }
    }

    private function crearRascas(Coleccion $coleccion, $numRascas, $premios)
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
        $disponibles = $coleccion->rascas()->where('proporcionado', false)->count();

        return Inertia::render('Coleccion/Show', [
            'coleccion' => $coleccion,
            'rascas_disponibles' => $disponibles,
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

    public function proporcionarRascas(Request $request, Coleccion $coleccion)
    {
        $validated = $request->validate([
            'cantidad' => 'required|integer|min:1|max:10000',
        ]);

        $cantidadSolicitada = $validated['cantidad'];

        // Obtener los rascas disponibles (no proporcionados) de forma aleatoria
        $rascasDisponibles = $coleccion->rascas()
            ->where('proporcionado', false)
            ->get()
            ->shuffle();

        if ($rascasDisponibles->count() < $cantidadSolicitada) {
            throw ValidationException::withMessages([
                'cantidad' => 'Solo quedan ' . $rascasDisponibles->count() . ' rascas disponibles en esta colección.',
            ]);
        }

        $rascasSeleccionados = $rascasDisponibles->take($cantidadSolicitada);

        // Marcar como proporcionados
        DB::transaction(function () use ($rascasSeleccionados) {
            foreach ($rascasSeleccionados as $rasca) {
                $rasca->proporcionado = true;
                $rasca->save();
            }
        });

        $urls = $rascasSeleccionados->map(fn($rasca) => route('rascas.show', $rasca->codigo))->all();

        return response()->json([
            'urls' => $urls,
        ]);
    }
}
