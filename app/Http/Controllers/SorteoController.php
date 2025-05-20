<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSorteoRequest;
use App\Http\Requests\UpdateSorteoRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Sorteo;
use App\Models\Ganador;
use App\Models\Comentario;
use App\Models\Host;
use App\Models\Publicacion;
use Illuminate\Support\Str;

class SorteoController extends Controller
{
    public function iniciar_manual(Request $request)
    {
        $request->validate([
            'nombre' => 'nullable|string|max:255',
            'num_ganadores' => 'required|integer|min:1',
            'num_suplentes' => 'required|integer|min:0',
            'participantes' => 'required|string',
            'eliminar_duplicados' => 'required|boolean',
        ]);

        $participantes = array_filter(array_map('trim', explode("\n", (string) $request->input('participantes', ''))));
        if ($request->boolean('eliminar_duplicados')) {
            $participantes = array_values(array_unique($participantes));
        }

        // Iniciamos la transacción
        DB::beginTransaction();

        try {
            // Crear y guardar el modelo Sorteo
            $sorteo = new Sorteo();
            $sorteo->user()->associate(Auth::user());
            $sorteo->nombre = $request->input('nombre');
            $sorteo->num_participantes = count($participantes);
            $sorteo->codigo_certificado = $this->generarCodigoCertificado();
            $sorteo->save();

            // Seleccionar y guardar los ganadores
            $this->seleccionarGanadores($participantes, $request, $sorteo);

            // Confirmar transacción
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al guardar el sorteo'], 500);
        }

        return response()->json([
            'ganadores' => $this->obtenerGanadores($sorteo),
            'urlHost' => null
        ]);
    }

    public function iniciar(Request $request)
    {
        $request->validate([
            'num_ganadores' => 'required|integer|min:1',
            'num_suplentes' => 'required|integer|min:0',
            'permitir_autores_duplicados' => 'required|boolean',
            'hashtag' => 'nullable|string',
            'mencion' => 'required|boolean',
            'participantes_manuales' => 'nullable|string',
            'usuarios_excluidos' => 'nullable|string',
        ]);


        // Obtener los datos y comentarios de la sesión
        $publicacion = Session::get('publicacion');
        $comentarios = Session::get('comentarios');

        if (!$comentarios || !$publicacion) {
            return response()->json(['error' => 'No hay datos de la publicación disponibles.'], 422);
        }


        // Aplicar los filtros definidos
        $comentariosFiltrados = $this->filtrarComentarios($comentarios, $request);

        // Obtener los participantes manuales
        $participantesManuales = array_filter(array_map('trim', explode("\n", (string) $request->input('participantes_manuales', ''))));

        // Array con todos los participantes
        $participantes = array_merge($comentariosFiltrados, $participantesManuales);

        // Iniciamos la transacción
        DB::beginTransaction();

        try {
            // Crear y guardar el modelo Publicacion
            $publicacion = new Publicacion($publicacion);
            $publicacion->host()->associate($publicacion->getHost());
            $publicacion->save();

            // Crear y guardar el modelo Sorteo
            $sorteo = new Sorteo();
            $sorteo->user()->associate(Auth::user());
            $sorteo->publicacion()->associate($publicacion);
            $sorteo->num_participantes = count($participantes);
            $sorteo->codigo_certificado = $this->generarCodigoCertificado();
            $sorteo->save();

            // Guardar el filtro aplicado
            $sorteo->filtro()->create([
                'mencion' => $request->boolean('mencion'),
                'hashtag' => $request->input('hashtag'),
                'permitir_autores_duplicados' => $request->boolean('permitir_autores_duplicados'),
            ]);

            // Seleccionar y guardar los ganadores y comentarios
            $this->seleccionarGanadores($participantes, $request, $sorteo);

            // Confirmar transacción
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al guardar el sorteo'], 500);
        }

        return response()->json([
            'ganadores' => $this->obtenerGanadores($sorteo),
            'urlHost' => $publicacion->host->url,
        ]);
    }

    private function filtrarComentarios(array $comentarios, Request $request): array
    {
        $comentarios = $this->excluirUsuarios($comentarios, $request);
        $comentarios = $this->filtroPalabra($comentarios, $request);
        $comentarios = $this->filtroMencion($comentarios, $request);
        $comentarios = $this->filtroDuplicados($comentarios, $request);

        return array_values($comentarios);
    }

    private function excluirUsuarios(array $comentarios, Request $request): array
    {
        $usuariosExcluidos = collect(explode("\n", (string) $request->input('usuarios_excluidos', '')))
            ->map(fn($u) => ltrim(strtolower(trim($u)), '@')) // quitamos el @ si lo hay
            ->filter();

        return array_filter($comentarios, function ($comentario) use ($usuariosExcluidos) {
            $autor = ltrim(strtolower($comentario['autor']), '@');
            return !$usuariosExcluidos->contains($autor);
        });
    }

    // Filtro por texto (palabra clave o #hashtag)
    private function filtroPalabra(array $comentarios, Request $request): array
    {
        $hashtag = $request->input('hashtag');

        if (!empty($hashtag)) {
            return array_filter($comentarios, function ($comentario) use ($hashtag) {
                return str_contains(strtolower($comentario['texto']), strtolower($hashtag));
            });
        }

        return $comentarios;
    }

    private function filtroMencion(array $comentarios, Request $request): array
    {
        if ($request->boolean('mencion')) {
            return array_filter($comentarios, function ($comentario) {
                return preg_match('/(^|\s)@\w+/', $comentario['texto']);
            });
        }

        return $comentarios;
    }

    private function filtroDuplicados(array $comentarios, Request $request): array
    {
        $permitirAutoresDuplicados = $request->boolean('permitir_autores_duplicados');

        if (!$permitirAutoresDuplicados) { // Eliminar autores duplicados
            $comentariosUnicos = [];
            $autoresVistos = [];

            foreach ($comentarios as $comentario) {
                $autor = strtolower($comentario['autor']);
                if (!in_array($autor, $autoresVistos)) {
                    $comentariosUnicos[] = $comentario;
                    $autoresVistos[] = $autor;
                }
            }

            return $comentariosUnicos;
        } else { // Eliminar comentarios duplicados
            $comentariosUnicos = [];
            $comentariosVistos = [];

            foreach ($comentarios as $comentario) {
                $clave = strtolower($comentario['autor'] . '|' . $comentario['texto']);
                if (!in_array($clave, $comentariosVistos)) {
                    $comentariosUnicos[] = $comentario;
                    $comentariosVistos[] = $clave;
                }
            }

            return $comentariosUnicos;
        }
    }

    private function seleccionarGanadores(array $participantes, Request $request, Sorteo $sorteo): void
    {
        $numGanadores = $request->num_ganadores;
        $numSuplentes = $request->num_suplentes;
        $totalNecesarios = $numGanadores + $numSuplentes;

        shuffle($participantes);

        $seleccionados = [];
        $nombresYaGanadores = [];

        foreach ($participantes as $participante) {
            $nombre = is_array($participante) ? $participante['autor'] : $participante;

            if (in_array(strtolower($nombre), $nombresYaGanadores)) {
                continue; // Ya ha ganado, lo saltamos
            }

            $nombresYaGanadores[] = strtolower($nombre); // Lo registramos como ya premiado
            $seleccionados[] = $participante;

            if (count($seleccionados) >= $totalNecesarios) {
                break; // Ya tenemos todos los ganadores necesarios
            }
        }

        foreach ($seleccionados as $index => $participante) {
            $esSuplente = $index >= $numGanadores;
            $posicion = $esSuplente ? $index - $numGanadores + 1 : $index + 1;

            $nombre = is_array($participante) ? $participante['autor'] : $participante;

            $ganador = new Ganador([
                'nombre_manual' => is_array($participante) ? null : $nombre,
                'posicion' => $posicion,
                'esSuplente' => $esSuplente,
            ]);

            $ganador->sorteo()->associate($sorteo);
            $ganador->save();

            if (is_array($participante)) {
                $comentario = new Comentario([
                    'autor' => $participante['autor'],
                    'texto' => $participante['texto'],
                    'fecha' => $participante['fecha'],
                    'likes' => $participante['likes'],
                ]);
                $comentario->ganador()->associate($ganador);
                $comentario->save();
            }
        }
    }

    // Obtener los ganadores recién creados para devolverlos
    private function obtenerGanadores(Sorteo $sorteo): array
    {
        return $sorteo->ganadores()
            ->leftJoin('comentarios', 'ganadores.id', '=', 'comentarios.ganador_id')
            ->select(
                'ganadores.nombre_manual',
                'ganadores.posicion',
                'ganadores.esSuplente',
                'comentarios.autor',
                'comentarios.texto',
                'comentarios.likes',
                'comentarios.fecha'
            )
            ->orderBy('esSuplente') // primero titulares
            ->orderBy('posicion')
            ->get()
            ->map(function ($g) use ($sorteo) {
                return [
                    'nombre' => $g->nombre_manual ?? $g->autor,
                    'clasificacion' => $g->esSuplente ? 'suplente' : 'titular',
                    'posicion' => $g->posicion,
                    'comentario' => $g->texto ?? null,
                    'likes' => $g->likes ?? null,
                    'fecha' => $g->fecha ?? null,
                    'sorteo_id' => $sorteo->id,
                ];
            })->toArray();
    }


    public function historial(Request $request)
    {
        $query = Auth::user()->sorteos()->with('publicacion.host');

        // Filtrar por año
        if ($request->filled('anyo')) {
            $query->whereYear('created_at', $request->anyo);
        } else {
            $anyoMasReciente = Auth::user()
                ->sorteos()
                ->selectRaw('EXTRACT(YEAR FROM created_at) as anyo')
                ->orderByDesc('anyo')
                ->limit(1)
                ->value('anyo');
            $request->merge(['anyo' => $anyoMasReciente]);
            $query->whereYear('created_at', $anyoMasReciente);
        }

        // Filtrar por tipo/host si está indicado
        if ($request->filled('tipo')) {
            if ($request->tipo === 'manual') {
                $query->whereNull('publicacion_id');
            } else {
                $query->whereHas('publicacion', function ($q) use ($request) {
                    $q->where('host_id', $request->tipo);
                });
            }
        }

        // Mapear resultados
        $sorteos = $query->orderByDesc('created_at')->get()->map(function ($sorteo) {
            return [
                'id' => $sorteo->id,
                'url' => $sorteo->publicacion?->url,
                'titulo' => $sorteo->publicacion?->titulo ?? $sorteo->nombre, // Si es manual, usamos el nombre
                'tipo' => $sorteo->publicacion?->host?->nombre ?? 'Manual',
                'num_participantes' => $sorteo->num_participantes,
                'created_at' => $sorteo->created_at,
                'certificado' => $sorteo->codigo_certificado,
            ];
        });

        $anyos = Auth::user()->sorteos()
            ->selectRaw('EXTRACT(YEAR FROM created_at) as anyo')
            ->groupBy('anyo')
            ->orderByDesc('anyo')
            ->pluck('anyo');

        $hosts = Host::select('id', 'nombre')->get();

        return Inertia::render('Sorteo/Historial', [
            'sorteos' => $sorteos,
            'anyos' => $anyos,
            'anyoSeleccionado' => $request->anyo,
            'tipoSeleccionado' => $request->tipo,
            'hosts' => $hosts,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sorteo $sorteo)
    {
        Gate::authorize('view', $sorteo);

        $sorteo->load([
            'filtro',
            'publicacion.host',
            'ganadores.comentario',
        ]);

        $publicacion = $sorteo->publicacion;

        return Inertia::render('Sorteo/Show', [
            'sorteo' => [
                'id' => $sorteo->id,
                'url' => $publicacion?->url,
                'urlHost' => $publicacion?->host?->url,
                'titulo' => $sorteo->publicacion?->titulo ?? $sorteo->nombre, // Si es manual, usamos el nombre
                'tipo' => $publicacion?->host?->nombre ?? 'Manual',
                'num_participantes' => $sorteo->num_participantes,
                'created_at' => $sorteo->created_at,
                'user_id' => $sorteo->user_id,
                'certificado' => $sorteo->codigo_certificado,
                'filtro' => $sorteo->filtro ? [
                    'mencion' => $sorteo->filtro->mencion,
                    'hashtag' => $sorteo->filtro->hashtag,
                    'permitir_autores_duplicados' => $sorteo->filtro->permitir_autores_duplicados,
                ] : null,
                'ganadores' => $sorteo->ganadores->map(function ($g) {
                    return [
                        'nombre' => $g->nombre_manual ?? $g->comentario?->autor,
                        'clasificacion' => $g->esSuplente ? 'suplente' : 'titular',
                        'posicion' => $g->posicion,
                        'comentario' => $g->comentario?->texto,
                        'likes' => $g->comentario?->likes,
                        'fecha' => $g->comentario?->fecha,
                    ];
                })->sortBy('posicion')->values()
            ],
        ]);
    }

    function generarCodigoCertificado(int $longitud = 7): string
    {
        do {
            $codigo = Str::upper(Str::random($longitud));
        } while (Sorteo::where('codigo_certificado', $codigo)->exists());

        return $codigo;
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
        Gate::authorize('delete', $sorteo);

        $sorteo->delete();
        return Inertia::location(route('sorteo.historial'));
    }
}
