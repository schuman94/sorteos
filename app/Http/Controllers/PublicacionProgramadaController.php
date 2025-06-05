<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePublicacionProgramadaRequest;
use App\Http\Requests\UpdatePublicacionProgramadaRequest;
use App\Models\Host;
use App\Models\Publicacion;
use Illuminate\Support\Facades\Auth;
use App\Models\PublicacionProgramada;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicacionProgramadaController extends Controller
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
    public function create(Request $request)
    {
        $urls = $request->input('urls', []);

        if (empty($urls)) {
            return redirect()->back()->withErrors(['urls' => 'No se proporcionaron URLs.']);
        }

        return Inertia::render('PublicacionProgramada/Create', [
            'urls' => $urls,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mensaje_base' => 'required|string|max:280',
            'inicio' => 'required|date|after_or_equal:now',
            'intervalo' => 'required|integer|min:1|max:168',
            'urls' => 'required|array|min:1',
            'urls.*' => 'required|url',
        ]);

        $host = Host::where('nombre', 'Bluesky')->first();
        $inicio = Carbon::parse($validated['inicio']);

        foreach ($validated['urls'] as $i => $url) {
            $publicacion = new PublicacionProgramada();
            $publicacion->mensaje = $validated['mensaje_base'] . "\n" . $url;
            $publicacion->fecha_programada = $inicio->copy()->addHours($validated['intervalo'] * $i);
            $publicacion->publicado = false;
            $publicacion->fallido = false;
            $publicacion->user()->associate(Auth::user());
            $publicacion->host()->associate($host);
            $publicacion->save();
        }

        return redirect()->route('colecciones.index')->with('success', 'Publicaciones programadas correctamente.');
    }


    /**
     * Display the specified resource.
     */
    public function show(PublicacionProgramada $publicacionProgramada)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PublicacionProgramada $publicacionProgramada)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePublicacionProgramadaRequest $request, PublicacionProgramada $publicacionProgramada)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PublicacionProgramada $publicacionProgramada)
    {
        //
    }
}
