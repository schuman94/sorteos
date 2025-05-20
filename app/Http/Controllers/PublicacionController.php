<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Session;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use App\Models\Publicacion;


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
            // Crear la instancia de publicacion
            $publicacion = new Publicacion(['url' => $request->input('url')]);

            // Cargar los datos desde la API correspondiente
            $publicacion->cargarDatosDesdeApi();

            // Retornar la respuesta con los datos
            return response()->json($publicacion);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => 'La URL no corresponde a una publicación válida.'], 422);
        } catch (\RuntimeException $e) {
            return response()->json(['error' => $this->traducirError($e->getMessage())], 422);
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
            // Crear la instancia de publicacion
            $publicacion = new Publicacion(['url' => $request->input('url')]);

            // Cargar los datos desde la API correspondiente
            $publicacion->cargarDatosDesdeApi();

            // Cargar los comentarios desde la API correspondiente
            $publicacion->cargarComentariosDesdeApi();

            // Almacenar los datos de la publicacion en la sesión
            // el metodo toArray excluye los comentarios por no ser un atributo persistido del modelo
            Session::put('publicacion', $publicacion->toArray());
            // Almacenar los comentarios de la publicacion en la sesión.
            Session::put('comentarios', $publicacion->comentarios);

            // Peticion get a /sorteo (los datos y comentarios se cargan desde la sesión)
            return Inertia::location(route('sorteo'));
        } catch (\RuntimeException $e) {
            return back()->withErrors([
                'url' => $this->traducirError($e->getMessage()),
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'url' => 'Ha ocurrido un error inesperado al cargar los comentarios. Inténtalo más tarde.',
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
        $porPagina = 10;

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

    /**
     * Traduce errores lanzados por los servicios de APIs como YouTube o Bluesky.
     */
    private function traducirError(string $codigo): string
    {
        return match (true) {
            // YouTube
            $codigo === 'youtube:cuota' => 'Se ha alcanzado el límite de uso. Inténtalo más tarde.',
            $codigo === 'youtube:comentarios_desactivados' => 'Los comentarios de este video están desactivados.',
            $codigo === 'youtube:sin_comentarios' => 'Este video no tiene comentarios.',
            $codigo === 'youtube:sin_datos' => 'No se ha encontrado información para este video.',
            str_starts_with($codigo, 'youtube:error:') => 'Error al consultar los datos de YouTube: ' . substr($codigo, strlen('youtube:error:')),

            // Bluesky
            $codigo === 'bluesky:autenticacion' => 'Error al acceder a Bluesky.',
            $codigo === 'bluesky:sin_respuestas' => 'Esta publicación no tiene comentarios.',
            $codigo === 'bluesky:error:datos_incompletos' => 'No se pudo obtener toda la información de la publicación de Bluesky.',
            $codigo === 'bluesky:error:post' => 'No se pudieron obtener los datos de la publicación.',
            $codigo === 'bluesky:error:respuestas' => 'No se pudieron obtener los comentarios de la publicación.',
            $codigo === 'bluesky:error:no_encontrado' => 'La publicación no existe o no se ha podido encontrar en Bluesky.',
            str_starts_with($codigo, 'bluesky:error:') => 'Error al consultar datos de Bluesky: ' . substr($codigo, strlen('bluesky:error:')),

            // Otros
            default => 'Error al procesar la publicación: ' . $codigo,
        };
    }
}
