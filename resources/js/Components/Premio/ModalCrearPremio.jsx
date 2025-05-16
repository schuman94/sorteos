import axios from '@/lib/axios';
import { useState } from 'react';

export default function ModalNuevoPremio({ visible, onClose, onCrearPremio }) {
    const [formData, setFormData] = useState({
        nombre: '',
        proveedor: '',
        valor: '',
        descripcion: '',
        link: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleGuardar = async () => {
        const { nombre, proveedor, valor } = formData;

        if (!nombre || !proveedor || !valor) {
            setError('Nombre, proveedor y valor son obligatorios.');
            return;
        }

        try {
            const response = await axios.post(route('premios.storeAndLoad'), formData);
            onCrearPremio?.(response.data);
            onClose();
        } catch (error) {
            console.error(error);
            if (error.response?.data?.errors?.nombre) {
                setError(error.response.data.errors.nombre[0]);
            } else {
                setError('Hubo un error al guardar el premio.');
            }
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-6">Nuevo Premio</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="nombre" className="block font-medium mb-1">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="Nombre del premio"
                        />
                    </div>

                    <div>
                        <label htmlFor="proveedor" className="block font-medium mb-1">Proveedor</label>
                        <input
                            type="text"
                            name="proveedor"
                            id="proveedor"
                            value={formData.proveedor}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="Proveedor"
                        />
                    </div>

                    <div>
                        <label htmlFor="valor" className="block font-medium mb-1">Valor (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="valor"
                            id="valor"
                            value={formData.valor}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="Valor en euros"
                        />
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block font-medium mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="Descripción del premio"
                        />
                    </div>

                    <div>
                        <label htmlFor="link" className="block font-medium mb-1">Link (opcional)</label>
                        <input
                            type="url"
                            name="link"
                            id="link"
                            value={formData.link}
                            onChange={handleChange}
                            className="input w-full"
                            placeholder="https://..."
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardar}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Crear y añadir
                    </button>
                </div>
            </div>
        </div>
    );
}
