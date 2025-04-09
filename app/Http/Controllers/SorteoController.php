<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSorteoRequest;
use App\Http\Requests\UpdateSorteoRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Sorteo;
use App\Models\Ganador;
use App\Models\Comentario;
use App\Models\Clasificacion;

class SorteoController extends Controller
{
    public function iniciar(Request $request)
    {
        $request->validate([
            'url' => 'nullable|url|required_without:participantes_manuales',
            'titulo' => 'nullable|string|required_without:participantes_manuales',
            'tipo' => 'nullable|string',
            'num_ganadores' => 'required|integer|min:1',
            'num_suplentes' => 'required|integer|min:0',
            'permitir_autores_duplicados' => 'required|boolean',
            'hashtag' => 'nullable|string',
            'mencion' => 'required|boolean',
            'participantes_manuales' => 'nullable|string|required_without:url',
            'usuarios_excluidos' => 'nullable|string',
        ]);


        // Obtener comentarios de la sesión
        $comentarios = Session::get('comentarios', []);

        // Aplicar los filtros definidos
        $comentariosFiltrados = $this->filtrarComentarios($comentarios, $request);

        // Obtener los participantes manuales
        $participantesManuales = array_filter(array_map('trim', explode("\n", (string) $request->input('participantes_manuales', ''))));

        // Array con todos los participantes
        $participantes = array_merge($comentariosFiltrados, $participantesManuales);

        // Iniciamos la transacción
        DB::beginTransaction();

        try {
            // Creamos el sorteo. Pendiente implementar una transaccion
            $sorteo = new Sorteo();
            $sorteo->user()->associate(Auth::user());
            $sorteo->url = $request->url;
            $sorteo->tipo = $request->tipo;
            $sorteo->titulo = $request->titulo;
            $sorteo->num_participantes = count($participantes);
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


        // Obtener los ganadores recién creados para devolverlos como JSON
        $ganadores = $sorteo->ganadores()
            ->with('clasificacion')
            ->leftJoin('comentarios', 'ganadores.id', '=', 'comentarios.ganador_id')
            ->select(
                'ganadores.nombre_manual',
                'ganadores.posicion',
                'clasificaciones.nombre as clasificacion',
                'comentarios.autor',
                'comentarios.texto',
                'comentarios.likes',
                'comentarios.fecha'
            )
            ->join('clasificaciones', 'clasificaciones.id', '=', 'ganadores.clasificacion_id')
            ->orderByRaw("clasificaciones.nombre = 'titular' DESC")
            ->orderBy('posicion')
            ->get()
            ->map(function ($g) {
                return [
                    'nombre' => $g->nombre_manual ?? $g->autor,
                    'clasificacion' => $g->clasificacion,
                    'posicion' => $g->posicion,
                    'comentario' => $g->texto ?? null,
                    'likes' => $g->likes ?? null,
                    'fecha' => $g->fecha ?? null,
                ];
            });


        return response()->json([
            'ganadores' => $ganadores,
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

        // Mezclar aleatoriamente los participantes
        shuffle($participantes);

        // Limitar a los necesarios
        $seleccionados = array_slice(array_values($participantes), 0, $totalNecesarios);

        foreach ($seleccionados as $index => $participante) {
            $esTitular = $index < $numGanadores;
            $posicion = $esTitular ? $index + 1 : $index - $numGanadores + 1;

            $nombre = is_array($participante) ? $participante['autor'] : $participante;

            // Obtener la clasificación correspondiente
            $clasificacion = Clasificacion::where('nombre', $esTitular ? 'titular' : 'suplente')->firstOrFail();

            // Crear el ganador
            $ganador = new Ganador([
                'nombre_manual' => is_array($participante) ? null : $nombre,
                'posicion' => $posicion,
            ]);

            $ganador->sorteo()->associate($sorteo);
            $ganador->clasificacion()->associate($clasificacion);
            $ganador->save();

            // Si tiene comentario, crear el modelo Comentario
            if (is_array($participante)) {
                $comentario = new Comentario([
                    'autor' => $participante['autor'],
                    'texto' => $participante['texto'],
                    'fecha' => $participante['fecha'],
                    'likes' => $participante['likes'] ?? 0,
                ]);
                $comentario->ganador()->associate($ganador);
                $comentario->save();
            }
        }
    }

    public function historial(Request $request)
    {
        $query = Auth::user()->sorteos();

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

        // Filtrar por tipo si está indicado
        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        $sorteos = $query->orderByDesc('created_at')->get()->map(function ($sorteo) {
            return [
                'id' => $sorteo->id,
                'url' => $sorteo->url,
                'titulo' => $sorteo->titulo,
                'tipo' => $sorteo->tipo,
                'num_participantes' => $sorteo->num_participantes,
                'created_at' => $sorteo->created_at->toDateTimeString(),
            ];
        });

        $anyos = Auth::user()->sorteos()
            ->selectRaw('EXTRACT(YEAR FROM created_at) as anyo')
            ->groupBy('anyo')
            ->orderByDesc('anyo')
            ->pluck('anyo');

        return Inertia::render('Sorteo/Historial', [
            'sorteos' => $sorteos,
            'anyos' => $anyos,
            'anyoSeleccionado' => $request->anyo,
            'tipoSeleccionado' => $request->tipo,
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
