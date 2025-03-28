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
        // Si la url no está vacia, se comprueba si hay que añadirle 'https://'
        $inputUrl = trim($request->input('url'));
        if (!empty($inputUrl) && !preg_match('#^https?://#i', $inputUrl)) {
            $inputUrl = 'https://' . $inputUrl;
        }
        $request->merge(['url' => $inputUrl]);

        // Validar la URL
        $request->validate([
            'url' => ['required', 'url'],
        ], [
            // Si hay un error de validacion, se redirige de vuelta y se recogen con: const { errors } = usePage().props
            // Se acceden a ellos con errors.url
            'url.required' => 'Por favor, introduce una URL.',
            'url.url' => 'Introduce un formato de URL válido.',
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

        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => 'La URL no corresponde a una publicación válida.'], 422);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => 'No se pudieron obtener los datos. Verifica que la publicación exista y sea pública.'], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde.'], 500);
        }
    }
}
