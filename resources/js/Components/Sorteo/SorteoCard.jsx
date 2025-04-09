import React from 'react';

export default function SorteoCard({ sorteo }) {
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition w-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                <a
                    href={sorteo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    {sorteo.titulo}
                </a>
            </h2>

            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>{sorteo.tipo}</strong></p>
                <p><strong>Participantes:</strong> {sorteo.num_participantes}</p>
                <p><strong>Fecha:</strong> {new Date(sorteo.created_at).toLocaleString()}</p>
            </div>

            {/* añadir boton ver sorteo (show) */}
        </div>
    );
}
