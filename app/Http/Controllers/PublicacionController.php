<?php

namespace App\Http\Controllers;

use App\Domain\Publicacion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

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
            // Crear la instancia adecuada (YouTubeVideo, InstagramPost o Reel)
            $publicacion = Publicacion::crear($request->input('url'));

            // Cargar los datos desde la API correspondiente
            $publicacion->cargarDatosDesdeApi();


            // Retornar el componente Inertia con la información
            return Inertia::render('Publicacion/Show', [
                'autor' => $publicacion->getAutor(),
                'numComentarios' => $publicacion->getNumComentarios(),
                'likes' => $publicacion->getLikes(),
                'fechaPublicacion' => optional($publicacion->getFechaPublicacion())->toDateTimeString(),
                // Atributos específicos de YouTubeVideo (si es YouTube)
                'titulo' => method_exists($publicacion, 'getTitulo') ? $publicacion->getTitulo() : null,
                'visualizaciones' => method_exists($publicacion, 'getVisualizaciones') ? $publicacion->getVisualizaciones() : null,
            ]);

        } catch (\Exception $e) {
            // Manejo de errores: redirigimos atrás con un mensaje
            return Redirect::back()->withErrors(['url' => $e->getMessage()]);
        }
    }
}
