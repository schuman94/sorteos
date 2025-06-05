<?php

namespace App\Jobs;

use App\Models\PublicacionProgramada;
use App\Services\BlueskyService;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class PublicarEnBluesky implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public PublicacionProgramada $publicacion;

    public function __construct(PublicacionProgramada $publicacion)
    {
        $this->publicacion = $publicacion;
    }

    public function handle(): void
    {
        // Evitar publicaciones duplicadas o inválidas
        if ($this->publicacion->publicado || $this->publicacion->fallido) {
            return;
        }

        if ($this->publicacion->host->nombre !== 'Bluesky') {
            $this->publicacion->update([
                'fallido' => true,
                'error_mensaje' => 'Host no soportado: ' . $this->publicacion->host->nombre,
            ]);
            return;
        }

        try {
            app(BlueskyService::class)->publicar($this->publicacion->mensaje);

            $this->publicacion->update([
                'publicado' => true,
                'publicado_en' => now(),
            ]);
        } catch (\Throwable $e) {
            $this->publicacion->update([
                'fallido' => true,
                'error_mensaje' => $e->getMessage(),
            ]);
        }
    }
}
