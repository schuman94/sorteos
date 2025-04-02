<?php

namespace App\Domain;
use App\Services\YouTubeService;
use Illuminate\Support\Facades\App;
use Carbon\Carbon;

class YouTubeVideo extends Publicacion
{
    // Atributos específicos de un video de YouTube (tradicional o short)
    protected ?string $titulo = null;
    protected ?int $visualizaciones = null;

    public function __construct(string $url)
    {
        parent::__construct($url);
        $this->id = $this->extraerVideoId($url);
    }

    private function extraerVideoId(string $url): string
    {
        // Formato tradicional: youtube.com/watch?v=id
        $queryString = parse_url($url, PHP_URL_QUERY);
        parse_str($queryString, $params);

        if (isset($params['v'])) {
            return $params['v'];
        }

        // Formato simplificado: youtu.be/id
        $path = parse_url($url, PHP_URL_PATH);
        if ($path) {
            return ltrim($path, '/'); // quita la barra inicial
        }

        // En caso de no poder extraerlo, lanza excepción
        throw new \InvalidArgumentException('No se pudo extraer el ID de YouTube');
    }

    public function getTitulo(): ?string
    {
        return $this->titulo;
    }

    public function getVisualizaciones(): ?int
    {
        return $this->visualizaciones;
    }

    public function cargarDatosDesdeApi(): void
    {
        $youtubeService = app(YouTubeService::class);
        $response = $youtubeService->getVideoData($this->id);

        // Verificar si hay algún error o si la estructura es la esperada
        if (isset($response['error'])) {
            // Manejo de errores (podrías lanzar una excepción o dejarlo en null)
            throw new \RuntimeException('Error en la API de YouTube: ' . $response['error']['message']);
        }

        // Extraer la información del primer item (si existe)
        $items = $response['items'] ?? [];
        if (empty($items)) {
            // Manejo de caso sin resultados
            throw new \RuntimeException('No se encontró información para el video con ID ' . $this->id);
        }

        $video = $items[0];
        $snippet = $video['snippet'] ?? [];
        $statistics = $video['statistics'] ?? [];

        // Asignar atributos comunes
        $this->setAutor($snippet['channelTitle'] ?? null);

        $this->setNumComentarios(
            isset($statistics['commentCount'])
                ? (int) $statistics['commentCount']
                : null
        );

        $this->setLikes(
            isset($statistics['likeCount'])
                ? (int) $statistics['likeCount']
                : null);

        if (isset($snippet['publishedAt'])) {
            $this->setFechaPublicacion(new Carbon($snippet['publishedAt']));
        }

        // Asignar atributos específicos
        $this->titulo = $snippet['title'] ?? null;

        $this->visualizaciones = isset($statistics['viewCount'])
            ? (int) $statistics['viewCount']
            : null;
    }

    public function cargarComentariosDesdeApi(): void
    {
        $youtubeService = app(YouTubeService::class); //Pendiente optimizar esto, para que no se ejecute dos veces
        $response = $youtubeService->getComentarios($this->id);

        foreach ($response as $item) {
            $topComment = $item['snippet']['topLevelComment']['snippet'] ?? null;

            if ($topComment) {
                $this->comentarios[] = [
                    'autor' => $topComment['authorDisplayName'] ?? 'Anónimo',
                    'texto' => $topComment['textOriginal'] ?? '',
                    'fecha' => $topComment['publishedAt'] ?? null,
                    'likes' => $topComment['likeCount'] ?? 0,
                ];
            }

            // Añadir respuestas si existen
            if (isset($item['replies']['comments'])) {
                foreach ($item['replies']['comments'] as $reply) {
                    $replySnippet = $reply['snippet'] ?? null;

                    if ($replySnippet) {
                        $this->comentarios[] = [
                            'autor' => $replySnippet['authorDisplayName'] ?? 'Anónimo',
                            'texto' => $replySnippet['textOriginal'] ?? '',
                            'fecha' => $replySnippet['publishedAt'] ?? null,
                            'likes' => $replySnippet['likeCount'] ?? 0,
                        ];
                    }
                }
            }
        }

        // Ordenar los comentarios empezando por el más reciente (ya no importa el nivel)
        usort($this->comentarios, function ($a, $b) {
            return strtotime($b['fecha']) <=> strtotime($a['fecha']);
        });

        // Si no se cargó ningún comentario
        if (empty($this->comentarios)) {
            throw new \RuntimeException('El video no tiene comentarios aún.');
        }
    }
}
