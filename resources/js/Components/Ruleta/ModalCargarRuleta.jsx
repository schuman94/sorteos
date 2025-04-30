import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export default function ModalCargarRuleta({ visible, onClose, onSeleccionar }) {
    const [ruletas, setRuletas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (visible) {
            setCargando(true);
            axios.get(route('ruletas.index'))
                .then(response => {
                    setRuletas(response.data);
                    setCargando(false);
                    setError(null);
                })
                .catch(error => {
                    console.error('Error al cargar ruletas:', error);
                    setError('No se pudieron cargar tus ruletas.');
                    setCargando(false);
                });
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Cargar una ruleta guardada</h2>

                {cargando && <p className="text-gray-600">Cargando ruletas...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!cargando && !error && (
                    <ul className="space-y-2 mb-4">
                        {ruletas.length > 0 ? (
                            ruletas.map(ruleta => (
                                <li key={ruleta.id}>
                                    <button
                                        onClick={() => {
                                            onSeleccionar(ruleta);
                                            onClose();
                                        }}
                                        className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                                    >
                                        {ruleta.nombre}
                                        <span className="block text-xs text-gray-500">
                                            {new Date(ruleta.created_at).toLocaleString()}
                                        </span>
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No tienes ruletas guardadas.</p>
                        )}
                    </ul>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
