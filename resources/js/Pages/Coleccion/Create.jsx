import MainLayout from '@/Layouts/MainLayout';
import ModalCrearPremio from '@/Components/Premio/ModalCrearPremio';
import ModalCargarPremio from '@/Components/Premio/ModalCargarPremio';
import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Index() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [numeroRascas, setNumeroRascas] = useState(1);
    const [premios, setPremios] = useState([]);
    const [showPremiosModal, setShowPremiosModal] = useState(false);
    const [showNuevoPremioModal, setShowNuevoPremioModal] = useState(false);

    const handleAddPremio = (premio) => {
        setPremios([...premios, { premio, cantidad: 1 }]);
        setShowPremiosModal(false);
    };

    const handleCreatePremio = (nuevoPremio) => {
        setPremios([...premios, { premio: nuevoPremio, cantidad: 1 }]);
        setShowNuevoPremioModal(false);
    };

    const handleDeletePremio = (index) => {
        const newPremios = premios.filter((_, i) => i !== index);
        setPremios(newPremios);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            nombre,
            descripcion,
            numeroRascas,
            premios: premios.map(p => ({
                premio_id: p.premio.id,
                cantidad: p.cantidad,
            })),
        };

        try {
            await router.post(route('colecciones.store'), data);
        } catch (error) {
            console.error('Error al crear colección:', error);
        }
    };

    return (
        <>
            <Head title="Colecciones" />
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-8 text-center">Crear Colección</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre de la Colección</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Nombre de la colección"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Descripción de la colección"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Número de Rascas</label>
                        <input
                            type="number"
                            value={numeroRascas}
                            onChange={(e) => setNumeroRascas(Number(e.target.value))}
                            min="1"
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setShowPremiosModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Añadir Premio
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowNuevoPremioModal(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Nuevo Premio
                        </button>
                    </div>

                    <div className="mt-4">
                        {premios.length > 0 && (
                            <div className="space-y-2">
                                {premios.map((premioData, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span>{premioData.premio.nombre}</span>
                                        <input
                                            type="number"
                                            value={premioData.cantidad}
                                            onChange={(e) => {
                                                const newPremios = [...premios];
                                                newPremios[index].cantidad = Number(e.target.value);
                                                setPremios(newPremios);
                                            }}
                                            className="w-16 rounded-md border-gray-300 shadow-sm"
                                            min="1"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePremio(index)}
                                            className="text-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md"
                    >
                        Crear Colección
                    </button>
                </form>

                <ModalCargarPremio
                    visible={showPremiosModal}
                    onClose={() => setShowPremiosModal(false)}
                    onSeleccionarPremio={handleAddPremio}
                />

                <ModalCrearPremio
                    visible={showNuevoPremioModal}
                    onClose={() => setShowNuevoPremioModal(false)}
                    onCrearPremio={handleCreatePremio}
                />
            </div>
        </>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;
