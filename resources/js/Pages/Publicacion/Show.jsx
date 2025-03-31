import React from 'react';
import { router } from '@inertiajs/react';

export default function Show({ autor, numComentarios, likes, fechaPublicacion, titulo, visualizaciones, url }) {
    const cargarComentarios = () => {
        router.post(route('publicacion.comentarios'), { url });
    };

    // Obtiene la ruta actual
    const rutaActual = window.location.pathname;

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded bg-white shadow dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl font-semibold mb-4">Datos de la publicación</h2>

            {titulo && <p className="mb-2"><strong>Título:</strong> {titulo}</p>}
            <p className="mb-2"><strong>Autor:</strong> {autor}</p>
            <p className="mb-2"><strong>Comentarios:</strong> {numComentarios?.toLocaleString()}</p>
            <p className="mb-2"><strong>Likes:</strong> {likes?.toLocaleString()}</p>
            <p className="mb-2"><strong>Fecha:</strong> {new Date(fechaPublicacion).toLocaleDateString()}</p>
            {visualizaciones !== null && (
                <p className="mb-2"><strong>Visualizaciones:</strong> {visualizaciones?.toLocaleString()}</p>
            )}

            {/* Renderiza el botón solo si no estás en la ruta de comentarios */}
            {rutaActual !== '/comentarios' && (
                <button
                    onClick={cargarComentarios}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Cargar comentarios
                </button>
            )}
        </div>
    );
}
