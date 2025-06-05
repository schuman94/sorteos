<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class BlueskyService
{
    private string $handle;
    private string $password;
    private string $baseUrl = 'https://bsky.social/xrpc';
    private ?string $authToken = null;

    public function __construct()
    {
        // Cargamos las credenciales desde el archivo .env
        $this->handle = config('services.bluesky.handle');
        $this->password = config('services.bluesky.password');
    }

    /**
     * Autenticación con Bluesky para obtener un token JWT.
     * Sólo se ejecuta si aún no tenemos un token guardado.
     */
    private function authenticate(bool $force = false): void
    {
        if ($this->authToken && !$force) return;

        $response = Http::post("{$this->baseUrl}/com.atproto.server.createSession", [
            'identifier' => $this->handle,
            'password' => $this->password,
        ]);

        if (!$response->ok()) {
            $mensaje = $response->json()['error'] ?? 'Error desconocido';
            throw new \RuntimeException('bluesky:auth:' . $mensaje);
        }

        $this->authToken = $response['accessJwt'];
    }

    public function getToken(): string
    {
        $this->authenticate();
        return $this->authToken;
    }

    public function getHandle(): string
    {
        return $this->handle;
    }

    /**
     * Devuelve los datos de una publicación a partir de su URI Bluesky.
     */
    public function getPost(string $uri): array
    {
        return $this->withRetryOnExpiredToken(function () use ($uri) {
            $response = Http::withToken($this->authToken)
                ->get("{$this->baseUrl}/app.bsky.feed.getPostThread", [
                    'uri' => $uri,
                ]);

            $response = Http::withToken($this->authToken)
                ->get("{$this->baseUrl}/app.bsky.feed.getPostThread", [
                    'uri' => $uri,
                ]);

            if (!$response->ok()) {
                throw new \RuntimeException('bluesky:error:post');
            }

            $json = $response->json();

            // Si la publicación no existe o ha sido eliminada, la clave 'thread' no estará o será null
            if (!isset($json['thread']['post'])) {
                throw new \RuntimeException('bluesky:error:no_encontrado');
            }

            return $json['thread']['post'];
        });
    }

    /**
     * Devuelve las respuestas/comentarios de una publicación.
     */
    public function getRespuestas(string $uri): array
    {
        return $this->withRetryOnExpiredToken(function () use ($uri) {
            $response = Http::withToken($this->authToken)
                ->get("{$this->baseUrl}/app.bsky.feed.getPostThread", [
                    'uri' => $uri,
                ]);

            if (!$response->ok()) {
                $mensaje = $response->json()['error'] ?? 'Error desconocido';
                throw new \RuntimeException('bluesky:comentarios:' . $mensaje);
            }

            return $response->json()['thread']['replies'] ?? [];
        });
    }

    public function publicar(string $mensaje): void
    {
        $this->withRetryOnExpiredToken(function () use ($mensaje) {
            $response = Http::withToken($this->authToken)->post("{$this->baseUrl}/com.atproto.repo.createRecord", [
                'repo' => $this->handle,
                'collection' => 'app.bsky.feed.post',
                'record' => [
                    'text' => $mensaje,
                    'createdAt' => now()->toISOString(),
                    '$type' => 'app.bsky.feed.post',
                ],
            ]);

            if (!$response->ok()) {
                throw new \RuntimeException('Error al publicar: ' . $response->body());
            }
        });
    }

    private function withRetryOnExpiredToken(callable $callback)
    {
        try {
            $this->authenticate(); // asegurar autenticación previa
            return $callback();
        } catch (\RuntimeException $e) {
            if (str_contains($e->getMessage(), 'ExpiredToken')) {
                $this->authenticate(true); // forzar reautenticación
                return $callback(); // reintentar una vez
            }

            throw $e;
        }
    }
}
