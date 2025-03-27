import React from 'react';

export default function Show({ autor, numComentarios, likes, fechaPublicacion, titulo, visualizaciones }) {
    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">Datos de la publicación</h1>
            {titulo && <p><strong>Título:</strong> {titulo}</p>}
            <p><strong>Autor:</strong> {autor}</p>
            <p><strong>Comentarios:</strong> {numComentarios}</p>
            <p><strong>Likes:</strong> {likes}</p>
            <p><strong>Fecha:</strong> {fechaPublicacion}</p>
            {visualizaciones && <p><strong>Visualizaciones:</strong> {visualizaciones}</p>}
        </div>
    );
}
