<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRascaRequest;
use App\Http\Requests\UpdateRascaRequest;
use App\Models\Rasca;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Mail;
use App\Mail\RascaPremiadoUsuario;
use App\Mail\RascaPremiadoCreador;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

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
        // Validar que sea un UUID válido
        if (!Str::isUuid($codigo)) {
            abort(404);
        }

        $rasca = Rasca::with(['coleccion.rascas.premio', 'premio'])->where('codigo', $codigo)->firstOrFail();

        if (is_null($rasca->provided_at)) {
            // abort(403, 'Este rasca no ha sido proporcionado.');
            abort(404); // No hay que dar pistas de que este rasca existe.
        }

        $coleccion = $rasca->coleccion;
        $rascasTotales = $coleccion->rascas->count();

        $premios = $coleccion->rascas
            ->whereNotNull('premio_id')
            ->groupBy('premio_id')
            ->map(function ($group) use ($rascasTotales) {
                $premio = $group->first()->premio;
                $cantidad = $group->count();
                $probabilidad = round(($cantidad / $rascasTotales) * 100, 2);

                return [
                    'nombre'        => $premio->nombre,
                    'link'          => $premio->link,
                    'cantidad'      => $cantidad,
                    'probabilidad'  => $probabilidad,
                    'thumbnail_url' => $premio->thumbnail_url,
                ];
            })
            ->values();

        return Inertia::render('Rascas/Show', [
            'rasca' => [
                'codigo'         => $rasca->codigo,
                'scratched_at'   => $rasca->scratched_at,
                'es_propietario' => Auth::id() && $rasca->scratched_by === Auth::id(),
                'coleccion' => [
                    'nombre'         => $coleccion->nombre,
                    'descripcion'    => $coleccion->descripcion,
                    'abierta'        => $coleccion->abierta,
                    'total_rascas'   => $rascasTotales,
                    'premios'        => $premios,
                ],
                'premio' => $rasca->scratched_at && $rasca->premio ? [
                    'nombre'        => $rasca->premio->nombre,
                    'descripcion'   => $rasca->premio->descripcion,
                    'proveedor'     => $rasca->premio->proveedor,
                    'link'          => $rasca->premio->link,
                    'thumbnail_url' => $rasca->premio->thumbnail_url,
                ] : null,
            ],
        ]);
    }

    public function premiados(Request $request)
    {
        $rascasQuery = Rasca::with(['premio', 'coleccion'])
            ->whereNotNull('premio_id')
            ->whereNotNull('scratched_at')
            ->where('scratched_by', Auth::id());

        // Filtro de búsqueda por texto
        if ($search = $request->input('search')) {
            $rascasQuery->where(function ($q) use ($search) {
                $q->whereHas('premio', function ($q2) use ($search) {
                    $q2->where('nombre', 'ilike', "%{$search}%")
                        ->orWhere('proveedor', 'ilike', "%{$search}%");
                })->orWhereHas('coleccion', function ($q2) use ($search) {
                    $q2->where('nombre', 'ilike', "%{$search}%");
                });
            });
        }

        // Filtro por año
        if ($anyo = $request->input('anyo')) {
            $rascasQuery->whereYear('scratched_at', $anyo);
        }

        $sort = $request->input('sort', 'scratched_at');
        $direction = $request->input('direction', 'desc');
        $perPage = 20;
        $currentPage = LengthAwarePaginator::resolveCurrentPage();

        // Si el ordenamiento es por columna relacionada
        if (in_array($sort, ['premio', 'proveedor', 'coleccion'])) {
            $rascas = $rascasQuery->get();

            $rascas = $rascas->sortBy(function ($rasca) use ($sort) {
                return match ($sort) {
                    'premio' => $rasca->premio->nombre ?? '',
                    'proveedor' => $rasca->premio->proveedor ?? '',
                    'coleccion' => $rasca->coleccion->nombre ?? '',
                    default => '',
                };
            }, SORT_REGULAR, $direction === 'desc')->values();

            // Paginar manualmente
            $paginated = new LengthAwarePaginator(
                $rascas->forPage($currentPage, $perPage),
                $rascas->count(),
                $perPage,
                $currentPage,
                ['path' => request()->url(), 'query' => request()->query()]
            );
        } else {
            // Ordenamiento directo en base de datos
            $rascasQuery->orderBy($sort, $direction);
            $paginated = $rascasQuery->paginate($perPage)->withQueryString();
        }

        // Años disponibles
        $anyos = Rasca::where('scratched_by', Auth::id())
            ->whereNotNull('scratched_at')
            ->selectRaw('DISTINCT EXTRACT(YEAR FROM scratched_at) AS anyo')
            ->orderByDesc('anyo')
            ->pluck('anyo');

        // Mapear
        $final = $paginated->through(fn($rasca) => [
            'id'            => $rasca->id,
            'codigo'        => $rasca->codigo,
            'scratched_at'  => $rasca->scratched_at,
            'premio'        => $rasca->premio?->nombre,
            'proveedor'     => $rasca->premio?->proveedor,
            'coleccion'     => $rasca->coleccion?->nombre,
            'premio_link'   => $rasca->premio?->link,
            'thumbnail_url' => $rasca->premio?->thumbnail_url,
        ]);

        return Inertia::render('Rascas/Premiados', [
            'premiados' => $final,
            'anyos'     => $anyos,
            'filters'   => [
                'search'    => $search,
                'anyo'      => $anyo,
                'sort'      => $sort,
                'direction' => $direction,
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
        $rasca = Rasca::with(['coleccion.user', 'premio'])->where('codigo', $codigo)->firstOrFail();

        if (is_null($rasca->provided_at)) {
            return redirect()->back()->with('warning', 'Este rasca aún no ha sido proporcionado.');
        }

        if (!is_null($rasca->scratched_at) || !is_null($rasca->scratched_by)) {
            return redirect()->back()->with('warning', 'Este rasca ya ha sido rascado previamente.');
        }

        if (!$rasca->coleccion->abierta) {
            abort(403, 'Esta colección está cerrada. No se puede rascar.');
        }

        // Guardamos si ha sido premiado
        $premiado = false;
        $usuario = Auth::user();
        $coleccion = $rasca->coleccion;

        DB::transaction(function () use ($rasca, $usuario, &$premiado) {
            $rasca->scratched_at = now();
            $rasca->scratched_by = $usuario->id;
            $rasca->save();

            $premiado = !is_null($rasca->premio);

            // Si todos los rascas han sido rascados, cerramos la colección
            $coleccion = $rasca->coleccion;

            $quedanPorRascar = $coleccion->rascas()
                ->whereNull('scratched_at')
                ->exists();

            if (!$quedanPorRascar) {
                $coleccion->abierta = false;
                $coleccion->save();
            }
        });

        // Enviar correos solo si el rasca ha sido premiado
        if ($premiado) {
            $premio = $rasca->premio;

            try {
                Mail::to($usuario->email)->queue(new RascaPremiadoUsuario(
                    rasca: $rasca,
                    premio: $premio,
                ));
            } catch (\Throwable $e) {
                Log::error('Error al encolar correo al usuario premiado: ' . $e->getMessage());
            }

            try {
                Mail::to($coleccion->user->email)->queue(new RascaPremiadoCreador(
                    usuario: $usuario,
                    rasca: $rasca,
                    premio: $premio,
                ));
            } catch (\Throwable $e) {
                Log::error('Error al encolar correo al creador de la colección: ' . $e->getMessage());
            }
        }

        return redirect()->route('rascas.show', $rasca->codigo);
    }
}
