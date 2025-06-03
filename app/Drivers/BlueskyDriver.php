<?php

namespace App\Drivers;

use App\Interfaces\PublicacionDriver;
use App\Models\Publicacion;
use App\Services\BlueskyService;
use Carbon\Carbon;

class BlueskyDriver implements PublicacionDriver
{
    private string $uri;

    public function __construct(string $url)
    {
        $this->uri = $this->getUri($url);
    }

    /**
     * Convierte una URL de Bluesky a una URI válida para su API.
     * Ejemplo: https://bsky.app/profile/handle/postId -> at://handle/app.bsky.feed.post/postId
     */
    private function getUri(string $url): string
    {
        $parsed = parse_url($url);
        $segments = explode('/', trim($parsed['path'], '/'));

        // Validamos que tenga al menos estos elementos: profile, {handle}, post, {post_id}
        if (count($segments) < 4 || $segments[0] !== 'profile' || $segments[2] !== 'post') {
            throw new \InvalidArgumentException('URL de Bluesky no válida');
        }
        // Ejemplos:
        $handle = $segments[1];    // usuario.bsky.social
        $postId = $segments[3];    // 3lnvborea4c2p

        return "at://{$handle}/app.bsky.feed.post/{$postId}";
    }


    public function cargarDatos(Publicacion $publicacion): void
    {
        $service = app(BlueskyService::class);
        $post = $service->getPost($this->uri);

        // Validar que los datos clave están presentes
        if (!isset($post['author']['handle'], $post['record']['createdAt'])) {
            throw new \RuntimeException('bluesky:error:datos_incompletos');
        }

        $publicacion->autor = $post['author']['handle'] ?? null;
        $publicacion->fecha_publicacion = Carbon::parse($post['record']['createdAt']);
        $publicacion->titulo = $post['record']['text'] ?? '[Publicación de Bluesky]';
        $publicacion->num_comentarios = $post['replyCount'] ?? null;
        $publicacion->likes = $post['likeCount'] ?? null;
        $publicacion->visualizaciones = null;
    }

    public function cargarComentarios(Publicacion $publicacion): void
    {
        $service = app(BlueskyService::class); // Usa el singleton ya registrado
        $comentarios = $service->getRespuestas($this->uri);

        $formateados = array_map(function ($c) {
            return [
                'autor' => $c['post']['author']['handle'] ?? 'Anónimo',
                'texto' => $c['post']['record']['text'] ?? '',
                'fecha' => $c['post']['record']['createdAt'] ?? null,
                'likes' => null, // Por ahora Bluesky no expone likes individuales
            ];
        }, $comentarios);

        usort($formateados, fn($a, $b) => strtotime($b['fecha']) <=> strtotime($a['fecha']));

        if (empty($formateados)) {
            throw new \RuntimeException('bluesky:sin_respuestas');
        }

        $publicacion->comentarios = $formateados;
    }
}
