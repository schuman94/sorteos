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
    *  - part: parte de la información que se desea recibir. En este caso, 'snippet'.
    *  - key: API KEY obtenida del archivo .env
    *
    * @param  string  $videoId  Identificador único del video en YouTube.
    * @return array   Array asociativo con la respuesta JSON decodificada.
    */
    public function getComentarios($videoId)
    {
        $url = 'https://www.googleapis.com/youtube/v3/commentThreads';

        $response = Http::get($url, [
            'videoId' => $videoId,
            'part' => 'snippet',
            'maxResults' => 10,
            'order' => 'time',
            'key' => $this->apiKey,
        ]);

        return $response->json();
    }

}
