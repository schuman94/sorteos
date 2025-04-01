import React, { useEffect, useState } from 'react';
import axios from '../../lib/axios';

export default function Comentarios() {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(route('comentarios.visualizar'))
            .then(response => {
                setComentarios(response.data);
            })
            .catch(err => {
                setError('No se pudieron cargar los comentarios');
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4">Lista de comentarios</h2>

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Cargando comentarios...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : comentarios.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No se han encontrado comentarios.</p>
            ) : (
                <ul className="space-y-4">
                    {comentarios.map((comentario, index) => (
                        <li key={index} className="border-b pb-4">
                            <p className="font-semibold">{comentario.autor}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(comentario.fecha).toLocaleString()}
                            </p>
                            <p className="mt-1">{comentario.texto}</p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Likes: {comentario.likes}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
