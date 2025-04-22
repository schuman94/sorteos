import MainLayout from '@/Layouts/MainLayout';
import React, { useState } from 'react';
import Ganadores from '@/Components/Sorteo/Ganadores';
import { Head } from '@inertiajs/react';
import axios from '@/lib/axios';

export default function Manual() {
    const [formData, setFormData] = useState({
        num_ganadores: 1,
        num_suplentes: 0,
        participantes: '',
        eliminar_duplicados: false,
    });

    const [cargando, setCargando] = useState(false);
    const [ganadores, setGanadores] = useState(null);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const iniciarSorteo = async () => {
        setCargando(true);
        try {
            const response = await axios.post(route('sorteo.manual.iniciar'), formData);
            setGanadores(response.data.ganadores);
        } catch (error) {
            console.error("Error al iniciar el sorteo:", error);
            alert(error.response?.data?.message || 'Error al iniciar el sorteo');
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <Head title="Sorteo Manual" />
            <div className="min-h-screen bg-gray-50 dark:bg-black text-black/70 dark:text-white/70 py-16 px-4">
                {!ganadores ? (
                    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Sorteo Manual</h2>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="num_ganadores" className="block mb-1 font-medium">Nº de ganadores</label>
                                <input
                                    type="number"
                                    name="num_ganadores"
                                    id="num_ganadores"
                                    value={formData.num_ganadores}
                                    onChange={handleChange}
                                    className="input w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="num_suplentes" className="block mb-1 font-medium">Nº de suplentes</label>
                                <input
                                    type="number"
                                    name="num_suplentes"
                                    id="num_suplentes"
                                    value={formData.num_suplentes}
                                    onChange={handleChange}
                                    className="input w-full"
                                />
                            </div>

                            <div>
                                <label htmlFor="participantes" className="block mb-1 font-medium">Participantes</label>
                                <textarea
                                    name="participantes"
                                    id="participantes"
                                    placeholder="Un nombre por línea"
                                    value={formData.participantes}
                                    onChange={handleChange}
                                    className="input w-full"
                                    rows={6}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="eliminar_duplicados"
                                    id="eliminar_duplicados"
                                    checked={formData.eliminar_duplicados}
                                    onChange={handleChange}
                                />
                                <label htmlFor="eliminar_duplicados">Eliminar nombres duplicados</label>
                            </div>
                        </div>

                        <button
                            onClick={iniciarSorteo}
                            disabled={cargando}
                            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            {cargando ? 'Iniciando...' : 'Iniciar Sorteo'}
                        </button>
                    </div>
                ) : (
                    <Ganadores ganadores={ganadores} urlHost={null} />
                )}
            </div>
        </>
    );
}

Manual.layout = (page) => <MainLayout>{page}</MainLayout>;
