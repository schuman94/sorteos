import React, { useState, useEffect } from 'react';

export default function ModalGuardarRuleta({ visible, onClose, onGuardarNueva, onActualizar, ruletaCargada }) {
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        // Si hay una ruleta cargada, rellenamos el input
        if (ruletaCargada) {
            setNombre(ruletaCargada.nombre);
        } else {
            setNombre('');
        }
    }, [ruletaCargada, visible]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">
                    {ruletaCargada ? 'Guardar cambios o duplicar' : 'Guardar nueva ruleta'}
                </h2>

                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-4"
                    placeholder="Nombre de la ruleta"
                    autoFocus
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancelar
                    </button>

                    {ruletaCargada && (
                        <button
                            onClick={() => onActualizar(nombre)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={nombre.trim() === ''}
                        >
                            Actualizar
                        </button>
                    )}
                    <button
                        onClick={() => onGuardarNueva(nombre)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={nombre.trim() === ''}
                    >
                        {ruletaCargada ? 'Guardar como nueva' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
