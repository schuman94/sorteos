<?php

namespace App\Domain;
use Carbon\Carbon;

abstract class Publicacion
{
    protected string $url;
    protected string $id;

    // Atributos "comunes" a ambas redes
    protected ?string $autor = null;            // nombre del canal de YouTube o usuario de Instagram
    protected ?int $numComentarios = null;      // número de comentarios
    protected ?int $likes = null;               // likes (YouTube) o "me gusta" (Instagram)
    protected ?Carbon $fechaPublicacion = null; // fecha de publicación

    // array donde se cargan los comentarios
    protected array $comentarios = [];

    public function __construct(string $url)
    {
        $this->url = $url;
    }

    // Métodos para setear y obtener los campos comunes
    public function getUrl(): string
    {
        return $this->url;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getAutor(): ?string
    {
        return $this->autor;
    }

    protected function setAutor(?string $autor): void
    {
        $this->autor = $autor;
    }

    public function getNumComentarios(): ?int
    {
        return $this->numComentarios;
    }

    protected function setNumComentarios(?int $numComentarios): void
    {
        $this->numComentarios = $numComentarios;
    }

    public function getLikes(): ?int
    {
        return $this->likes;
    }

    protected function setLikes(?int $likes): void
    {
        $this->likes = $likes;
    }

    public function getFechaPublicacion(): ?Carbon
    {
        return $this->fechaPublicacion;
    }

    protected function setFechaPublicacion(?Carbon $fecha): void
    {
        $this->fechaPublicacion = $fecha;
    }

    public function getComentarios()
    {
        return $this->comentarios;
    }

    // Método abstracto para cargar datos desde la API
    abstract public function cargarDatosDesdeApi(): void;

    // Método abstracto para cargar comentarios desde la API
    abstract public function cargarComentariosDesdeApi(): void;

    // Método *factory* estático para crear la subclase adecuada según la URL
    public static function crear(string $url): Publicacion
    {
        $host = parse_url($url, PHP_URL_HOST) ?? '';
        $host = strtolower($host);

        // Comprobar si es YouTube
        if (str_contains($host, 'youtube.com') || str_contains($host, 'youtu.be')) {
            return new YouTubeVideo($url);
        }

        /*
        // Comprobar si es Instagram
        if (str_contains($host, 'instagram.com')) {
            // Parsear el path: /p/ o /reel/
            $path = parse_url($url, PHP_URL_PATH) ?? '';
            $segments = explode('/', trim($path, '/'));

            // Determinar si es post o reel
            if (!empty($segments[0])) {
                if ($segments[0] === 'p') {
                    return new InstagramPost($url);
                } elseif ($segments[0] === 'reel') {
                    return new InstagramReel($url);
                }
            }

            throw new \InvalidArgumentException('URL de Instagram no reconocida (no es /p/ ni /reel/).');
        }
        */

        throw new \InvalidArgumentException('La URL no corresponde a una red soportada.');
    }

    // Devuelve un array asociativo con los datos que el cliente necesita para visualizar los datos de la publicación
    public function arrayData() {
        return [
            'autor' => $this->getAutor(),
            'numComentarios' => $this->getNumComentarios(),
            'likes' => $this->getLikes(),
            'fechaPublicacion' => $this->getFechaPublicacion()->toDateTimeString(),
            'titulo' => method_exists($this, 'getTitulo') ? $this->getTitulo() : null,
            'visualizaciones' => method_exists($this, 'getVisualizaciones') ? $this->getVisualizaciones() : null,
            'url' => $this->getUrl(),
            'tipo' => $this::class,
        ];
    }
}
