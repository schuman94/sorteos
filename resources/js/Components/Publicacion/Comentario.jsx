import React from 'react';

export default function Comentario({ autor, fecha, texto, likes }) {
    return (
        <li className="border-b pb-4">
            <p className="font-semibold">{autor}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(fecha).toLocaleString()}
            </p>
            <p className="mt-1">{texto}</p>
            {likes != null && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    👍 {likes}
                </p>
            )}
        </li>
    );
}
