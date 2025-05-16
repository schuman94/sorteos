<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePremioRequest;
use App\Http\Requests\UpdatePremioRequest;
use App\Models\Premio;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PremioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Premio::query()->where('user_id', Auth::id());

        // Filtro por búsqueda de texto
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'ilike', '%' . $search . '%')
                    ->orWhere('proveedor', 'ilike', '%' . $search . '%');
            });
        }

        // Filtro por año
        if ($anyo = $request->input('anyo')) {
            $query->whereYear('created_at', $anyo);
        }

        // Ordenamiento
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');

        $query->orderBy($sort, $direction);

        // Paginación
        $perPage = $request->wantsJson() ? 10 : 20;
        $premios = $query->paginate($perPage)->withQueryString();

        // Años disponibles para el select
        $anyos = Premio::where('user_id', Auth::id())
            ->selectRaw('DISTINCT EXTRACT(YEAR FROM created_at) AS anyo')
            ->orderByDesc('anyo')
            ->pluck('anyo');

        // Para el modal en el create de colecciones
        if ($request->wantsJson()) {
            return response()->json([
                'premios' => $premios,
                'filters' => [
                    'search' => $search,
                    'anyo' => $anyo,
                    'sort' => $sort,
                    'direction' => $direction,
                ],
                'anyos' => $anyos,
            ]);
        }

        // Para el index de premios
        return Inertia::render('Premios/Index', [
            'premios' => $premios,
            'filters' => [
                'search' => $search,
                'anyo' => $anyo,
                'sort' => $sort,
                'direction' => $direction,
            ],
            'anyos' => $anyos,
        ]);
    }



    public function cargarTodos()
    {
        $premios = Auth::user()->premios()->get();
        return response()->json($premios);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Premios/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:premios,nombre',
            'proveedor' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'link' => 'nullable|url',
        ]);

        $premio = new Premio($validated);
        $premio->user()->associate(Auth::user());
        $premio->save();

        return redirect()->route('premios.show', $premio)->with('success', 'Premio creado correctamente.');
    }

    public function storeAndLoad(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:premios,nombre',
            'proveedor' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'link' => 'nullable|url',
        ]);

        $premio = new Premio($validated);
        $premio->user()->associate(Auth::user());
        $premio->save();

        return response()->json($premio);
    }


    /**
     * Display the specified resource.
     */
    public function show(Premio $premio)
    {
        return Inertia::render('Premios/Show', [
            'premio' => $premio,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Premio $premio)
    {
        // pendiente gate/policy
        return Inertia::render('Premios/Edit', [
            'premio' => $premio,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Premio $premio)
    {
        // pendiente gate/policy

        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:premios,nombre,' . $premio->id,
            'proveedor' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'descripcion' => 'nullable|string',
            'link' => 'nullable|url',
        ]);

        $premio->update($validated);

        return redirect()->route('premios.show', $premio)->with('success', 'Premio actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Premio $premio)
    {
        // pendiente gate/policy


        // Un premio no se puede eliminar si está en algún rasca
        if ($premio->rascas()->exists()) {
            return back()->withErrors([
                'premio' => 'No se puede eliminar el premio porque está asociado a uno o más rascas.',
            ]);
        }

        $premio->delete();

        return redirect()->route('premios.index')->with('success', 'Premio eliminado.');
    }
}
