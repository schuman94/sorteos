import axios from '@/lib/axios';
import { useState } from 'react';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import BotonGris from '@/Components/Botones/BotonGris';
import { Gift } from 'lucide-react';

export default function ModalCrearPremio({ visible, onClose, onCrearPremio }) {
    const [formData, setFormData] = useState({
        nombre: '',
        proveedor: '',
        valor: '',
        descripcion: '',
        link: '',
    });
    const [imagen, setImagen] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleFileChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const handleGuardar = async () => {
        const { nombre, proveedor, valor } = formData;

        if (!nombre || !proveedor || !valor) {
            setError('Nombre, proveedor y valor son obligatorios.');
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (imagen) data.append('image', imagen);

        try {
            const response = await axios.post(route('premios.storeAndLoad'), data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
                <div className="bg-[#1cc2b5] px-6 py-4 flex items-center gap-3">
                    <Gift className="w-6 h-6 text-white" />
                    <h2 className="text-lg font-semibold text-white">Nuevo Premio</h2>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Nombre del premio"
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                        />
                    </div>

                    <div>
                        <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Proveedor
                        </label>
                        <input
                            type="text"
                            name="proveedor"
                            id="proveedor"
                            value={formData.proveedor}
                            onChange={handleChange}
                            placeholder="Proveedor"
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                        />
                    </div>

                    <div>
                        <label htmlFor="valor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Valor (€)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            name="valor"
                            id="valor"
                            value={formData.valor}
                            onChange={handleChange}
                            placeholder="Valor en euros"
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                        />
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Descripción del premio"
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 min-h-[80px] resize-y focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                        />
                    </div>

                    <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Link (opcional)
                        </label>
                        <input
                            type="url"
                            name="link"
                            id="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Imagen (opcional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id="image"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="flex justify-end gap-2 pt-4">
                        <BotonGris onClick={onClose}>Cancelar</BotonGris>
                        <BotonPrimario onClick={handleGuardar}>Crear y añadir</BotonPrimario>
                    </div>
                </div>
            </div>
        </div>
    );
}
