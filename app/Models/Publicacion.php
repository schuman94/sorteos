<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Interfaces\PublicacionDriver;
use App\Drivers\YouTubeDriver;
use App\Drivers\BlueskyDriver;
use App\Drivers\InstagramDriver;

class Publicacion extends Model
{
    /** @use HasFactory<\Database\Factories\PublicacionFactory> */
    use HasFactory;

    protected $table = 'publicaciones';

    protected $fillable = [
        'url',
        'autor',
        'fecha_publicacion',
        'titulo',
        'likes',
        'num_comentarios',
        'visualizaciones',
        'host_id',
        'thumbnail',
    ];

    protected $casts = [
        'fecha_publicacion' => 'datetime',
    ];

    public array $comentarios = [];

    public function sorteo()
    {
        return $this->hasOne(Sorteo::class);
    }

    public function host()
    {
        return $this->belongsTo(Host::class);
    }


    public function getHost(): Host
    {
        $dominio = parse_url($this->url, PHP_URL_HOST) ?? '';
        $dominio = strtolower(preg_replace('/^www\./', '', $dominio));
        $coincidencia = Dominio::where('nombre', $dominio)->with('host')->first();

        if (!$coincidencia || !$coincidencia->host) {
            throw new \RuntimeException("La URL no es válida.");
        }

        return $coincidencia->host;
    }

    // Detectar y retornar el driver adecuado
    public function getDriver(): PublicacionDriver
    {
        $host = $this->getHost();

        return match ($host->nombre) {
            'YouTube' => new YouTubeDriver($this->url),
            'Instagram' => new InstagramDriver($this->url),
            'Bluesky' => new BlueskyDriver($this->url),
            default => throw new \RuntimeException("La URL no corresponde a una red social soportada. Host analizado: '{$host->nombre}'"),
        };
    }

    public function cargarDatosDesdeApi(): void
    {
        $this->getDriver()->cargarDatos($this);
    }

    public function cargarComentariosDesdeApi(): void
    {
        $this->getDriver()->cargarComentarios($this);
    }
}
