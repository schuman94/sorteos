<?php

namespace App\Http\Controllers;

use App\Domain\Publicacion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;


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

            // Almacenar los datos de la publicación en la sesión
            Session::put('publicacionData', $publicacion->arrayData());

            // Retornar la respuesta con los datos
            return response()->json($publicacion->arrayData());

        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => 'La URL no corresponde a una publicación válida.'], 422);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => 'No se pudieron obtener los datos. Verifica que la publicación exista y sea pública.'], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde.'], 500);
        }
    }

    /**
     * Vuelve a obtener la información de la publicación (para que esté actualizada).
     * Obtiene los comentarios y los almacena en la sesión
     * Redirige a la vista sorteos
     */
    public function cargarComentarios(Request $request)
    {
        $request->validate([
            'url' => ['required', 'url'],
        ]);

        try {
            // Crear la instancia adecuada (YouTubeVideo, InstagramPost, etc.)
            $publicacion = Publicacion::crear($request->input('url'));

            // Cargar los datos desde la API correspondiente
            $publicacion->cargarDatosDesdeApi();

            // Almacenar los datos de la publicación en la sesión
            Session::put('publicacionData', $publicacion->arrayData());

            // Cargar los comentarios desde la API correspondiente
            $publicacion->cargarComentariosDesdeApi();

            // Almacenar los comentarios en la sesión
            Session::put('comentarios', $publicacion->getComentarios());

            // Retornar la vista con los datos
            return Inertia::render('Sorteo/Sorteo', array_merge(
                $publicacion->arrayData(),
                //['comentarios' => $publicacion->getComentarios()]
            ));

        } catch (\Exception $e) {
            return redirect()->route('home')->withErrors([
                'url' => 'Error al cargar los comentarios: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Obtiene los comentarios de la sesión.
     */
    public function visualizarComentarios()
    {
        $comentarios = Session::get('comentarios', []);

        // Obtenemos la página actual
        $paginaActual = LengthAwarePaginator::resolveCurrentPage();

        // Número de elementos por página
        $porPagina = 50;

        // Convertimos a colección para usar slice
        $coleccion = new Collection($comentarios);

        // Hacemos la paginación
        $comentariosPaginados = new LengthAwarePaginator(
            $coleccion->slice(($paginaActual - 1) * $porPagina, $porPagina)->values(),
            $coleccion->count(),
            $porPagina,
            $paginaActual,
            ['path' => route('comentarios.visualizar')]
        );

        return response()->json($comentariosPaginados);
    }

}
