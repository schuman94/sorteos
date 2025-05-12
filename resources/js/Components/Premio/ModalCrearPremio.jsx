import axios from '@/lib/axios';
import { useState } from 'react';

export default function ModalNuevoPremio({ visible, onClose, onCrearPremio }) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState('');

    const handleGuardar = async () => {
        if (!nombre || !descripcion) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.post(route('premios.store'), {
                nombre,
                descripcion,
            });

            onCrearPremio(response.data);
            onClose();
        } catch (error) {
            console.error(error);
            setError('Hubo un error al guardar el premio.');
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Nuevo Premio</h2>
                <div>
                    <label className="block">Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full border rounded px-3 py-2 mb-2"
                        placeholder="Nombre del premio"
                    />
                </div>

                <div>
                    <label className="block">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full border rounded px-3 py-2 mb-2"
                        placeholder="Descripción del premio"
                    />
                </div>

                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancelar</button>
                    <button onClick={handleGuardar} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Añadir Premio</button>
                </div>
            </div>
        </div>
    );
}
