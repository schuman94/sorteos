import React from 'react';
import Show from './Show';
import { Head } from '@inertiajs/react';

export default function Comentarios(props) {
    const { comentarios } = props;

    return (
        <>
            <Head title="Comentarios" />
            <div className="min-h-screen bg-gray-50 dark:bg-black text-black/70 dark:text-white/70 py-16 px-4">
                {/* Mostrar la información general de la publicación */}
                <div className="flex justify-center mb-12">
                    <Show {...props} />
                </div>

                {/* Mostrar los comentarios */}
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
                    <h2 className="text-2xl font-semibold mb-4">Lista de comentarios</h2>

                    {comentarios.length === 0 ? (
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
                </div>
            </div>
        </>
    );
}
