<?php

namespace App\Http\Controllers;

use App\Models\Sorteo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificadoController extends Controller
{
    public function show(string $codigo)
    {
        $sorteo = Sorteo::with(['ganadores.comentario', 'publicacion.host'])
            ->where('codigo_certificado', $codigo)
            ->withTrashed()
            ->firstOrFail();

        return Inertia::render('Certificado/Show', [
            'sorteo' => [
                'codigo_certificado' => $sorteo->codigo_certificado,
                'created_at'         => $sorteo->created_at,
                'num_participantes'  => $sorteo->num_participantes,
                'titulo'             => $sorteo->publicacion?->titulo,
                'url'                => $sorteo->publicacion?->url,
                'tipo'               => $sorteo->publicacion?->host?->nombre ?? 'Manual',
                'ganadores'          => $sorteo->ganadores->map(function ($g) {
                    return [
                        'nombre'        => $g->nombre_manual ?? $g->comentario?->autor,
                        'clasificacion' => $g->esSuplente ? 'suplente' : 'titular',
                        'posicion'      => $g->posicion,
                    ];
                })->sortBy('esSuplente')->sortBy('posicion')->values()
            ]
        ]);
    }
}
