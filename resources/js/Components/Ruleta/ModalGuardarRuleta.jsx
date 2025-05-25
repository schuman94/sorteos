import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import BotonGris from '@/Components/Botones/BotonGris';
import BotonAzul from '@/Components/Botones/BotonAzul';

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
                    opciones: opciones.map(op => op.option), // Genera un array de strings que el controlador convierte con json_encode
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
                    className={`w-full px-4 py-2 border-[1.5px] rounded-md bg-white text-gray-800
        focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]
        ${errorNombre ? 'border-red-500' : 'border-[#1cc2b5]'}`}
                    placeholder="Nombre de la ruleta"
                    autoFocus
                    disabled={guardando}
                />

                {errorNombre && <p className="text-red-600 text-sm mb-2">{errorNombre}</p>}

                <div className="flex justify-end gap-2 mt-4">
                    <BotonGris onClick={onClose} disabled={guardando}>
                        Cancelar
                    </BotonGris>

                    {ruletaCargada && (
                        <BotonAzul
                            onClick={() => guardar('actualizar')}
                            disabled={guardando}
                        >
                            Actualizar
                        </BotonAzul>
                    )}

                    <BotonPrimario
                        onClick={() => guardar('nueva')}
                        disabled={guardando}
                    >
                        Guardar
                    </BotonPrimario>
                </div>
            </div>
        </div>
    );
}
