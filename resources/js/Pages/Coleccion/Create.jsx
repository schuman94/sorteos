import MainLayout from '@/Layouts/MainLayout';
import ModalCrearPremio from '@/Components/Premio/ModalCrearPremio';
import ModalCargarPremio from '@/Components/Premio/ModalCargarPremio';
import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import BotonRosa from '@/Components/Botones/BotonRosa';
import BotonRojo from '@/Components/Botones/BotonRojo';
import { TicketCheck } from 'lucide-react';

export default function Index() {
    const { errors } = usePage().props;
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [numeroRascas, setNumeroRascas] = useState(1);
    const [premios, setPremios] = useState([]);
    const [showPremiosModal, setShowPremiosModal] = useState(false);
    const [showNuevoPremioModal, setShowNuevoPremioModal] = useState(false);

    const handleAddPremio = (nuevoPremio) => {
        const index = premios.findIndex(p => p.premio.id === nuevoPremio.id);

        if (index !== -1) {
            const nuevos = [...premios];
            nuevos[index].cantidad += 1;
            setPremios(nuevos);
        } else {
            setPremios([...premios, { premio: nuevoPremio, cantidad: 1 }]);
        }

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
            <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#1cc2b5] px-6 py-4 flex items-center gap-3">
                    <TicketCheck className="w-6 h-6 text-white" />
                    <h1 className="text-xl font-semibold text-white">Crear Colección</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de la Colección</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                            placeholder="Nombre de la colección"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                            placeholder="Descripción de la colección"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de Rascas</label>
                        <input
                            type="number"
                            value={numeroRascas}
                            onChange={(e) => setNumeroRascas(Number(e.target.value))}
                            min="1"
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <BotonPrimario type="button" onClick={() => setShowPremiosModal(true)}>
                            Añadir Premio
                        </BotonPrimario>
                        <BotonRosa type="button" onClick={() => setShowNuevoPremioModal(true)}>
                            Nuevo Premio
                        </BotonRosa>
                    </div>

                    <div className="mt-4">
                        {premios.length > 0 && (
                            <div className="space-y-2">
                                {premios.map((premioData, index) => (
                                    <div key={index} className="flex justify-between items-center gap-4 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md">
                                        <span className="flex-1">{premioData.premio.nombre}</span>
                                        <input
                                            type="number"
                                            value={premioData.cantidad}
                                            onChange={(e) => {
                                                const newPremios = [...premios];
                                                newPremios[index].cantidad = Number(e.target.value);
                                                setPremios(newPremios);
                                            }}
                                            className="w-16 border border-[#1cc2b5] rounded-md text-center"
                                            min="1"
                                        />
                                        <BotonRojo type="button" onClick={() => handleDeletePremio(index)}>
                                            Eliminar
                                        </BotonRojo>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {errors.premios && (
                        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">
                            {errors.premios}
                        </div>
                    )}

                    {premios.length > 0 && (
                        <div className="flex justify-center">
                            <BotonPrimario type="submit">Crear rascas</BotonPrimario>
                        </div>
                    )}

                </form>

                {showPremiosModal && (
                    <ModalCargarPremio
                        onClose={() => setShowPremiosModal(false)}
                        onSeleccionar={handleAddPremio}
                    />
                )}

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
