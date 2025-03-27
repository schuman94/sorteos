import React from 'react';

export default function Show({
    autor,
    numComentarios,
    likes,
    fechaPublicacion,
    titulo,
    visualizaciones
}) {
    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded bg-white shadow dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl font-semibold mb-4">Datos de la publicación</h2>

            {titulo && (
                <p className="mb-2">
                    <strong className="font-medium">Título:</strong> {titulo}
                </p>
            )}

            <p className="mb-2">
                <strong className="font-medium">Autor:</strong> {autor}
            </p>

            <p className="mb-2">
                <strong className="font-medium">Comentarios:</strong> {numComentarios?.toLocaleString()}
            </p>

            <p className="mb-2">
                <strong className="font-medium">Likes:</strong> {likes?.toLocaleString()}
            </p>

            <p className="mb-2">
                <strong className="font-medium">Fecha de publicación:</strong> {new Date(fechaPublicacion).toLocaleDateString()}
            </p>

            {visualizaciones !== null && (
                <p className="mb-2">
                    <strong className="font-medium">Visualizaciones:</strong> {visualizaciones?.toLocaleString()}
                </p>
            )}
        </div>
    );
}
