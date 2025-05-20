<?php

namespace App\Drivers;

use App\Interfaces\PublicacionDriver;
use App\Models\Publicacion;
use App\Services\YouTubeService;
use Carbon\Carbon;

class YouTubeDriver implements PublicacionDriver
{
    private string $id;

    public function __construct(string $url)
    {
        $this->id = $this->getId($url);
    }

    private function getId(string $url): string
    {
        $query = parse_url($url, PHP_URL_QUERY);
        parse_str($query, $params);

        if (isset($params['v']) && $params['v'] !== '') {
            return $params['v'];
        }

        $path = trim(parse_url($url, PHP_URL_PATH), '/');

        // Si es de tipo /shorts/{id}, lo extraemos.
        if (str_starts_with($path, 'shorts/')) {
            $segments = explode('/', $path);
            if (isset($segments[1]) && $segments[1] !== '') {
                return $segments[1];
            }
        }

        // Si es un path corto tipo youtu.be/{id}
        // La cadena debe tener exactamente 11 caracteres alfanuméricos o guiones, sin nada antes ni después.
        if (preg_match('/^[\w-]{11}$/', $path)) {
            return $path;
        }

        // Si llega aquí, no es un ID válido
        throw new \InvalidArgumentException('No se pudo extraer el ID de YouTube');
    }



    public function cargarDatos(Publicacion $publicacion): void
    {
        $service = app(YouTubeService::class);
        $response = $service->getVideoData($this->id);

        // Extraer la información del primer item (si existe)
        $items = $response['items'] ?? [];
        if (empty($items)) {
            // Manejo de caso sin resultados
            throw new \RuntimeException('No se encontró información para el video con ID ' . $this->id);
        }

        $video = $response['items'][0];
        $snippet = $video['snippet'] ?? [];
        $statistics = $video['statistics'] ?? [];

        // Asignar atributos
        $publicacion->autor = $snippet['channelTitle'] ?? null;
        $publicacion->fecha_publicacion = Carbon::parse($snippet['publishedAt']);
        $publicacion->titulo = $snippet['title'] ?? null;

        $publicacion->likes = isset($statistics['likeCount'])
            ? (int) $statistics['likeCount']
            : null;

        $publicacion->num_comentarios = isset($statistics['commentCount'])
            ? (int) $statistics['commentCount']
            : null;

        $publicacion->visualizaciones = isset($statistics['viewCount'])
            ? (int) $statistics['viewCount']
            : null;
    }

    public function cargarComentarios(Publicacion $publicacion): void
    {
        $service = app(YouTubeService::class);
        $response = $service->getComentarios($this->id);

        $comentarios = [];

        foreach ($response as $item) {
            $topComment = $item['snippet']['topLevelComment']['snippet'] ?? null;

            if ($topComment) {
                $comentarios[] = [
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
                        $comentarios[] = [
                            'autor' => $replySnippet['authorDisplayName'] ?? 'Anónimo',
                            'texto' => $replySnippet['textOriginal'] ?? '',
                            'fecha' => $replySnippet['publishedAt'] ?? null,
                            'likes' => $replySnippet['likeCount'] ?? 0,
                        ];
                    }
                }
            }
        }

        // Ordenar los comentarios por fecha descendente
        usort($comentarios, function ($a, $b) {
            return strtotime($b['fecha']) <=> strtotime($a['fecha']);
        });

        if (empty($comentarios)) {
            throw new \RuntimeException('youtube:sin_comentarios');
        }

        // Asignar los comentarios al modelo
        $publicacion->comentarios = $comentarios;
    }
}
