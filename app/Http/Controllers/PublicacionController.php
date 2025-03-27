<?php

namespace App\Http\Controllers;

use App\Domain\Publicacion;
use Illuminate\Http\Request;

class PublicacionController extends Controller
{
    /**
     * Procesa la URL introducida por el usuario y muestra la información de la publicación.
     */
    public function buscar(Request $request)
    {
        // Validar la URL
        $request->validate([
            'url' => ['required', 'url'],
        ]);

        try {
            // Crear la instancia adecuada (YouTubeVideo, InstagramPost, etc.)
            $publicacion = Publicacion::crear($request->input('url'));

            // Cargar los datos desde la API correspondiente
            $publicacion->cargarDatosDesdeApi();

            // Retornar el componente Home con la información adicional en el prop 'publicacionData'
            return response()->json([
                'autor' => $publicacion->getAutor(),
                'numComentarios' => $publicacion->getNumComentarios(),
                'likes' => $publicacion->getLikes(),
                'fechaPublicacion' => $publicacion->getFechaPublicacion()->toDateTimeString(),
                'titulo' => method_exists($publicacion, 'getTitulo') ? $publicacion->getTitulo() : null,
                'visualizaciones' => method_exists($publicacion, 'getVisualizaciones') ? $publicacion->getVisualizaciones() : null,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
