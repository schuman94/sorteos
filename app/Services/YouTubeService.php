<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class YoutubeService
{
    // API KEY obtenida de .env
    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.youtube.api_key');
    }

    /**
     * Obtiene la información de un video de YouTube usando la YouTube Data API v3.
     *
     * Este método envía una petición GET a la API, pasando como parámetros:
     *  - id: id del video obtenido a partir de su url.
     *  - part: parte de la información que se desea recibir. Es un string con varias claves separadas por coma:
     *      snippet: incluye datos como título, descripción, canal, miniatura, fecha, etc.
     *      statistics: incluye datos numéricos como visualizaciones, likes, etc.
     *  - key: API KEY obtenida de .env
     *
     * @param  string  $videoId  Identificador único del video en YouTube obtenido a partir de su url.
     * @return array   Array asociativo con la respuesta JSON decodificada.
     */
    public function getVideoData($videoId)
    {
        $url = 'https://www.googleapis.com/youtube/v3/videos';

        $response = Http::get($url, [
            'id' => $videoId,
            'part' => 'snippet,statistics',
            'key' => $this->apiKey,
        ]);

        return $response->json();
    }

    /**
    * Obtiene los comentarios de un video de YouTube usando la YouTube Data API v3.
    *
    * Este método envía una petición GET a la API, pasando como parámetros:
    *  - videoId: id del video del que se quieren obtener los comentarios.
    *  - part: parte de la información que se desea recibir. Snippet recupera los comentarios. Replies tambien recupera las respuestas.
    *  - key: API KEY obtenida del archivo .env
    *
    * @param  string  $videoId  Identificador único del video en YouTube.
    * @return array   Array asociativo con la respuesta JSON decodificada.
    */
    public function getComentarios(string $videoId): array
    {
        $url = 'https://www.googleapis.com/youtube/v3/commentThreads';
        $comentarios = [];
        $nextPageToken = null;

        do {
            $response = Http::get($url, [
                'videoId' => $videoId,
                'part' => 'snippet,replies',
                'maxResults' => 100,
                'order' => 'time',
                'key' => $this->apiKey,
                'pageToken' => $nextPageToken,
                'textFormat' => 'plainText',
            ]);

            $json = $response->json();

            // Verificar errores
            if (isset($json['error'])) {
                $message = $json['error']['message'];
                if (str_contains($message, 'has disabled comments')) {
                    throw new \RuntimeException('Los comentarios de este video están desactivados.');
                }

                throw new \RuntimeException('Error al obtener los comentarios: ' . $message);
            }

            $comentarios = array_merge($comentarios, $json['items'] ?? []);
            $nextPageToken = $json['nextPageToken'] ?? null;

        } while ($nextPageToken);

        return $comentarios;
    }

}
