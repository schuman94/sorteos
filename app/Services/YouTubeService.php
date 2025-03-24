<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class YoutubeService
{
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
        // API KEY obtenida de .env
        $apiKey = config('services.youtube.api_key');

        // URL fija a donde se envía la petición GET
        $url = 'https://www.googleapis.com/youtube/v3/videos';

        $response = Http::get($url, [
            'id' => $videoId,
            'part' => 'snippet,statistics',
            'key' => $apiKey,
        ]);

        return $response->json();
    }
}
