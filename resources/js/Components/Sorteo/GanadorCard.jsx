import React from 'react';

export default function GanadorCard({ nombre, posicion, comentario, likes, fecha, urlHost }) {
    const construirPerfil = () => {
        if (!comentario || !urlHost) return null;

        const username = nombre.startsWith('@') ? nombre.slice(1) : nombre;

        // Aseguramos que no haya doble barra
        const base = urlHost.endsWith('/') ? urlHost.slice(0, -1) : urlHost;

        // Si la plataforma es YouTube, incluimos @ en la URL
        if (base.includes('youtube')) {
            return `${base}/@${username}`;
        }

        // En otras plataformas como Instagram, sin @
        return `${base}/${username}`;
    };

    const perfilUrl = construirPerfil();

    return (
        <div className="p-4 bg-white dark:bg-gray-700 border rounded shadow-sm space-y-1">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Posición</span>
                <span className="text-pink-600 font-bold text-lg">{posicion}</span>
            </div>

            <div className="text-base font-semibold">
                {perfilUrl ? (
                    <a href={perfilUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">
                        {nombre}
                    </a>
                ) : (
                    nombre
                )}
            </div>

            {comentario && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <p className="mb-1 italic">{comentario}</p>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        {likes != null && (<span>👍 {likes ?? 0}</span>)}
                        <span>{new Date(fecha).toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
