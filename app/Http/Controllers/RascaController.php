<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRascaRequest;
use App\Http\Requests\UpdateRascaRequest;
use App\Models\Rasca;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
        $rasca = Rasca::with(['coleccion', 'premio'])->where('codigo', $codigo)->firstOrFail();

        // Si el rasca no ha sido proporcionado, abortar con 403
        if (is_null($rasca->provided_at)) {
            abort(403, 'Este rasca no ha sido proporcionado.');
        }

        return Inertia::render('Rascas/Show', [
            'rasca' => [
                'codigo' => $rasca->codigo,
                'scratched_at' => $rasca->scratched_at,
                'coleccion' => [
                    'nombre' => $rasca->coleccion->nombre,
                    'abierta' => $rasca->coleccion->abierta,
                ],
                'premio' => $rasca->scratched_at && $rasca->premio ? [
                    'nombre' => $rasca->premio->nombre,
                    'descripcion' => $rasca->premio->descripcion,
                    'proveedor' => $rasca->premio->proveedor,
                    'link' => $rasca->premio->link,
                ] : null,
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

    public function rascar(string $codigo)
    {
        $rasca = Rasca::with(['coleccion', 'premio'])->where('codigo', $codigo)->firstOrFail();

        if (is_null($rasca->provided_at)) {
            return redirect()->back()->with('warning', 'Este rasca aún no ha sido proporcionado.');
        }

        if (!is_null($rasca->scratched_at) || !is_null($rasca->scratched_by)) {
            return redirect()->back()->with('warning', 'Este rasca ya ha sido rascado previamente.');
        }

        if (!$rasca->coleccion->abierta) {
            abort(403, 'Esta colección está cerrada. No se puede rascar.');
        }

        DB::transaction(function () use ($rasca) {
            $rasca->scratched_at = now();
            $rasca->scratched_by = Auth::id();
            $rasca->save();

            // Verificar si todos los rascas proporcionados ya han sido rascados
            $coleccion = $rasca->coleccion;

            $quedanPorRascar = $coleccion->rascas()
                ->whereNull('scratched_at')
                ->exists();

            if (!$quedanPorRascar) {
                $coleccion->abierta = false;
                $coleccion->save();
            }
        });

        return redirect()->route('rascas.show', $rasca->codigo)->with('success', 'Rascado correctamente.');
    }
}
