import React, { useState, useEffect } from 'react';

export default function ModalGuardarRuleta({ visible, onClose, onGuardarNueva, onActualizar, ruletaCargada }) {
    const [nombre, setNombre] = useState('');
    const [errorNombre, setErrorNombre] = useState(null);

    useEffect(() => {
        setNombre(ruletaCargada ? ruletaCargada.nombre : '');
        setErrorNombre(null); // Limpiar errores al abrir
    }, [ruletaCargada, visible]);

    const handleGuardarNueva = () => {
        if (nombre.trim() === '') {
            setErrorNombre('Debes introducir un nombre.');
            return;
        }

        onGuardarNueva(nombre, {
            onError: (errors) => {
                if (errors?.nombre) setErrorNombre(errors.nombre);
            },
            onSuccess: () => {
                setErrorNombre(null);
            },
        });
    };

    const handleActualizar = () => {
        if (nombre.trim() === '') {
            setErrorNombre('Debes introducir un nombre.');
            return;
        }

        onActualizar(nombre, {
            onError: (errors) => {
                if (errors?.nombre) setErrorNombre(errors.nombre);
            },
            onSuccess: () => {
                setErrorNombre(null);
            },
        });
    };

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
                    onChange={(e) => {
                        setNombre(e.target.value);
                        setErrorNombre(null); // limpiar error al escribir
                    }}
                    className={`w-full border rounded px-3 py-2 mb-1 ${errorNombre ? 'border-red-500' : ''}`}
                    placeholder="Nombre de la ruleta"
                    autoFocus
                />
                {errorNombre && <p className="text-red-600 text-sm mb-2">{errorNombre}</p>}

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancelar
                    </button>

                    {ruletaCargada && (
                        <button
                            onClick={handleActualizar}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Actualizar
                        </button>
                    )}

                    <button
                        onClick={handleGuardarNueva}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        {ruletaCargada ? 'Guardar como nueva' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
