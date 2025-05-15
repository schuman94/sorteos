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
        $query = Premio::query()
            ->where('user_id', Auth::id());

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'ilike', '%' . $search . '%')
                    ->orWhere('proveedor', 'ilike', '%' . $search . '%');
            });
        }

        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');

        $query->orderBy($sort, $direction);

        $premios = $query->paginate(20)->withQueryString();

        return Inertia::render('Premios/Index', [
            'premios' => $premios,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
            ],
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
        ]);

        $premio = new Premio();
        $premio->nombre = $request->nombre;
        $premio->descripcion = $request->descripcion;
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePremioRequest $request, Premio $premio)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Premio $premio)
    {
        //
    }
}
