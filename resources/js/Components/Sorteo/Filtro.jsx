import React from 'react';

export default function Filtro({ filtro }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full">
            <h3 className="text-xl font-semibold text-left mb-4">Filtro aplicado</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li><strong>Hashtag:</strong> {filtro.hashtag || 'Ninguno'}</li>
                <li><strong>Mención:</strong> {filtro.mencion ? 'Sí' : 'No'}</li>
                <li><strong>Permitir autores duplicados:</strong> {filtro.permitir_autores_duplicados ? 'Sí' : 'No'}</li>
            </ul>
        </div>
    );
}
