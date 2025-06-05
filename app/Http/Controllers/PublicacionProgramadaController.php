<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePublicacionProgramadaRequest;
use App\Models\Coleccion;
use App\Models\Host;
use Illuminate\Support\Facades\Auth;
use App\Models\PublicacionProgramada;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class PublicacionProgramadaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $coleccion = Coleccion::findOrFail($request->input('coleccion_id'));

        $publicaciones = Auth::user()
            ->publicacionesProgramadas()
            ->where('coleccion_id', $coleccion->id)
            ->where('publicado', false)
            ->where('fallido', false)
            ->orderBy('fecha_programada')
            ->paginate(10);

        return Inertia::render('PublicacionProgramada/Index', [
            'publicaciones' => $publicaciones,
            'coleccion' => $coleccion,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $urls = $request->input('urls', []);
        $coleccionId = $request->input('coleccion_id');

        if (empty($urls)) {
            return redirect()->back()->withErrors(['urls' => 'No se proporcionaron URLs.']);
        }

        return Inertia::render('PublicacionProgramada/Create', [
            'urls' => $urls,
            'coleccionId' => $coleccionId,
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
            'intervalo' => ['nullable', 'integer', 'min:1', 'max:10080'], // hasta 7 días en minutos
            'unidad_intervalo' => ['nullable', 'in:minutos,horas'],
            'urls' => 'required|array|min:1',
            'urls.*' => 'required|url',
            'coleccion_id' => 'required|exists:colecciones,id',
        ]);

        $host = Host::where('nombre', 'Bluesky')->first();
        $coleccion = Coleccion::findOrFail($validated['coleccion_id']);
        $inicio = Carbon::parse($validated['inicio'], 'Europe/Madrid')->setTimezone('UTC');

        $esUnica = count($validated['urls']) === 1;
        $intervalo = $validated['intervalo'] ?? 0;
        $unidad = $validated['unidad_intervalo'] ?? 'minutos';

        foreach ($validated['urls'] as $i => $url) {
            $publicacion = new PublicacionProgramada();
            $publicacion->mensaje = trim($validated['mensaje_base']) . "\n\n" . $url;

            if ($esUnica) {
                $fecha = $inicio;
            } else {
                $diff = $unidad === 'horas' ? $intervalo * $i : $intervalo * $i / 60;
                $fecha = $inicio->copy()->addMinutes(round($diff * 60));
            }

            $publicacion->fecha_programada = $fecha;
            $publicacion->publicado = false;
            $publicacion->fallido = false;
            $publicacion->user()->associate(Auth::user());
            $publicacion->host()->associate($host);
            $publicacion->coleccion()->associate($coleccion);
            $publicacion->save();
        }

        return redirect()->route('colecciones.show', $coleccion->id)
            ->with('success', 'Programado correctamente.');
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
    public function destroy(PublicacionProgramada $publicacion)
    {
        Gate::authorize('update', $publicacion);
        $publicacion->delete();

        return back()->with('success', 'Publicación eliminada correctamente.');
    }
}
