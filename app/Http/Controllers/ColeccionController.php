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
use Illuminate\Support\Facades\Gate;

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
        // Cargar contadores agregados
        $coleccion->loadCount([
            'rascas as total_rascas' => fn($q) => $q,
            'rascas as rascas_restantes' => fn($q) => $q->whereNull('provided_at'),
            'rascas as total_proporcionados' => fn($q) => $q->whereNotNull('provided_at'),
            'rascas as total_rascados' => fn($q) => $q->whereNotNull('scratched_at'),
            'rascas as premios_obtenidos' => fn($q) => $q->whereNotNull('scratched_at')->whereNotNull('premio_id'),
        ]);

        // Agrupar premios con cantidad y valor total
        $premios = $coleccion->rascas()
            ->whereNotNull('premio_id')
            ->with('premio')
            ->get()
            ->groupBy('premio_id')
            ->map(function ($group) {
                $premio = $group->first()->premio;
                $cantidad = $group->count();

                return [
                    'id'           => $premio->id,
                    'nombre'       => $premio->nombre,
                    'proveedor'    => $premio->proveedor,
                    'link'         => $premio->link,
                    'cantidad'     => $cantidad,
                    'valor_total'  => $cantidad * $premio->valor,
                ];
            })
            ->values();

        // Calcular totales
        $valor_total = $premios->sum('valor_total');
        $total_premios = $coleccion->rascas()->whereNotNull('premio_id')->count();
        $premios_restantes = max(0, $total_premios - $coleccion->premios_obtenidos);

        // Devolver vista con datos explícitos
        return Inertia::render('Coleccion/Show', [
            'coleccion' => [
                'id'                => $coleccion->id,
                'nombre'            => $coleccion->nombre,
                'descripcion'       => $coleccion->descripcion,
                'created_at'        => $coleccion->created_at,
                'updated_at'        => $coleccion->updated_at,
                'user_id'           => $coleccion->user_id,
                'abierta'           => $coleccion->abierta,

                'total_rascas' => $coleccion->total_rascas,
                'rascas_restantes'     => $coleccion->rascas_restantes,
                'total_proporcionados' => $coleccion->total_proporcionados,
                'total_rascados'       => $coleccion->total_rascados,
                'premios_obtenidos'    => $coleccion->premios_obtenidos,

                'premios'           => $premios,
                'valor_total'       => $valor_total,
                'premios_restantes' => $premios_restantes,
            ],
            'urls' => session('urls', []),
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

        $rascasDisponibles = $coleccion->rascas()
            ->whereNull('provided_at')
            ->get()
            ->shuffle();

        if ($rascasDisponibles->count() < $cantidadSolicitada) {
            throw ValidationException::withMessages([
                'cantidad' => 'Solo quedan ' . $rascasDisponibles->count() . ' rascas disponibles en esta colección.',
            ]);
        }

        $rascasSeleccionados = $rascasDisponibles->take($cantidadSolicitada);

        DB::transaction(function () use ($rascasSeleccionados) {
            foreach ($rascasSeleccionados as $rasca) {
                $rasca->provided_at = now();
                $rasca->save();
            }
        });

        $urls = $rascasSeleccionados->map(fn($rasca) => route('rascas.show', $rasca->codigo))->all();

        return redirect()
            ->route('colecciones.show', $coleccion)
            ->with('urls', $urls);
    }

    public function rascasProporcionados(Request $request, Coleccion $coleccion)
    {
        $query = $coleccion->rascas()
            ->whereNotNull('provided_at')
            ->leftJoin('users', 'rascas.scratched_by', '=', 'users.id')
            ->leftJoin('premios', function ($join) {
                $join->on('rascas.premio_id', '=', 'premios.id')
                    ->whereNotNull('rascas.scratched_at'); // solo unir si ha sido rascado
            })
            ->select(
                'rascas.id',
                'rascas.codigo',
                'rascas.provided_at',
                'rascas.scratched_at',
                DB::raw("users.name as scratched_by"),
                DB::raw("premios.nombre as premio"),
                'rascas.premio_id'
            );

        // Filtro de búsqueda
        if ($search = $request->input('search')) {
            $query->where('rascas.codigo', 'ilike', "%{$search}%");
        }

        // Ordenación
        $sort = $request->input('sort', 'provided_at');
        $direction = $request->input('direction', 'desc');

        if (in_array($sort, ['codigo', 'scratched_at', 'scratched_by', 'provided_at', 'premio'])) {
            $query->orderBy($sort, $direction);
        }

        $rascas = $query->paginate(20)->withQueryString();

        return Inertia::render('Coleccion/Rascas', [
            'rascas' => $rascas,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
            ],
            'coleccion' => [
                'id' => $coleccion->id,
                'nombre' => $coleccion->nombre,
            ],
        ]);
    }

    public function toggleEstado(Coleccion $coleccion)
    {
        Gate::authorize('update', $coleccion);

        // Si se intenta abrir la colección, comprobamos si ya todos los rascas están rascados
        if (!$coleccion->abierta) {
            $todosRascados = !$coleccion->rascas()
                ->whereNull('scratched_at')
                ->exists();

            if ($todosRascados) {
                return back()->with('warning', 'No se puede abrir la colección porque todos los rascas han sido rascados.');
            }
        }

        $coleccion->abierta = !$coleccion->abierta;
        $coleccion->save();

        return back()->with('success', 'Estado de la colección actualizado.');
    }
}
