<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PublicacionProgramada;
use App\Jobs\PublicarEnBluesky;

class DespacharPublicacionesProgramadas extends Command
{
    protected $signature = 'bluesky:despachar-publicaciones';
    protected $description = 'Despacha publicaciones programadas pendientes para Bluesky';

    public function handle(): void
    {
        $pendientes = PublicacionProgramada::with('host')
            ->where('publicado', false)
            ->where('fallido', false)
            ->where('fecha_programada', '<=', now())
            ->get();

        foreach ($pendientes as $publicacion) {
            dispatch(new PublicarEnBluesky($publicacion));
        }

        $this->info("Despachadas {$pendientes->count()} publicaciones.");
    }
}
