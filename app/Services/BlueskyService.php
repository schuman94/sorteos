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
    private function authenticate(): void
    {
        if ($this->authToken) return;

        $response = Http::post("{$this->baseUrl}/com.atproto.server.createSession", [
            'identifier' => $this->handle,
            'password' => $this->password,
        ]);

        if (!$response->ok()) {
            throw new \RuntimeException('Error de autenticación con Bluesky.');
        }

        $this->authToken = $response['accessJwt'];
    }

    /**
     * Devuelve los datos de una publicación a partir de su URI Bluesky.
     */
    public function getPost(string $uri): array
    {
        $this->authenticate();

        $response = Http::withToken($this->authToken)
            ->get("{$this->baseUrl}/app.bsky.feed.getPostThread", [
                'uri' => $uri,
            ]);

        if (!$response->ok()) {
            throw new \RuntimeException('No se pudo obtener los datos de la publicación.');
        }

        return $response->json()['thread']['post'] ?? [];
    }

    /**
     * Devuelve las respuestas/comentarios de una publicación.
     */
    public function getRespuestas(string $uri): array
    {
        $this->authenticate();

        $response = Http::withToken($this->authToken)
            ->get("{$this->baseUrl}/app.bsky.feed.getPostThread", [
                'uri' => $uri,
            ]);

        if (!$response->ok()) {
            throw new \RuntimeException('No se pudieron obtener las respuestas.');
        }

        return $response->json()['thread']['replies'] ?? [];
    }
}
