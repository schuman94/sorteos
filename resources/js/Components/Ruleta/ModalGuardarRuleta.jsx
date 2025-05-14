import axios from '@/lib/axios';
import { useState, useEffect } from 'react';

export default function ModalGuardarRuleta({ visible, onClose, ruletaCargada, onGuardado, opciones }) {
    const [nombre, setNombre] = useState('');
    const [errorNombre, setErrorNombre] = useState(null);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        setNombre(ruletaCargada ? ruletaCargada.nombre : '');
        setErrorNombre(null);
    }, [ruletaCargada, visible]);

    const guardar = async (modo) => {
        if (nombre.trim() === '') {
            setErrorNombre('Debes introducir un nombre.'); // Esta validación eclipsa a la del validate. Evitamos hacer petición.
            return;
        }

        setGuardando(true);
        setErrorNombre(null);

        try {
            let response;

            if (modo === 'nueva') {
                response = await axios.post(route('ruletas.store'), {
                    nombre,
                    opciones: opciones.map(op => op.option),
                });
            } else if (modo === 'actualizar' && ruletaCargada) {
                response = await axios.put(route('ruletas.update', ruletaCargada.id), {
                    nombre,
                    opciones: opciones.map(op => op.option),
                });
            }

            onGuardado(response.data.ruleta); // Ejecuta la funcion definida en ruleta.jsx
            onClose(); // Ejecuta setMostrarModalGuardar(false) definido en ruleta.jsx
        } catch (error) {
            if (error.response?.status === 422 && error.response.data.errors?.nombre) {
                setErrorNombre(error.response.data.errors.nombre[0]);
            } else {
                setErrorNombre('Error al guardar la ruleta.');
            }
        } finally {
            setGuardando(false);
        }
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
                        setErrorNombre(null);
                    }}
                    className={`w-full border rounded px-3 py-2 mb-1 ${errorNombre ? 'border-red-500' : ''}`}
                    placeholder="Nombre de la ruleta"
                    autoFocus
                    disabled={guardando}
                />
                {errorNombre && <p className="text-red-600 text-sm mb-2">{errorNombre}</p>}

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        disabled={guardando}
                    >
                        Cancelar
                    </button>

                    {ruletaCargada && (
                        <button
                            onClick={() => guardar('actualizar')}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={guardando}
                        >
                            Actualizar
                        </button>
                    )}

                    <button
                        onClick={() => guardar('nueva')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={guardando}
                    >
                        {ruletaCargada ? 'Guardar como nueva' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
