import MainLayout from '@/Layouts/MainLayout';
import React, { useState } from 'react';
import Data from '@/Components/Publicacion/Data';
import Comentarios from '@/Components/Publicacion/Comentarios';
import Ganadores from '@/Components/Sorteo/Ganadores';
import { Head } from '@inertiajs/react';
import axios from '@/lib/axios';

export default function Sorteo(props) {
    const [formData, setFormData] = useState({
        url: props.url ?? '',
        num_ganadores: 1,
        num_suplentes: 0,
        permitir_autores_duplicados: false,
        hashtag: '',
        mencion: false,
        participantes_manuales: '',
        usuarios_excluidos: '',
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
            const response = await axios.post(route('sorteo.iniciar'), formData);
            setGanadores(response.data.ganadores); // Suponemos que devuelve un array de ganadores
        } catch (error) {
            console.error("Error al iniciar el sorteo:", error);
            alert('Ocurrió un error al iniciar el sorteo');
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <Head title="Sorteo" />

            <div className="min-h-screen bg-gray-50 dark:bg-black text-black/70 dark:text-white/70 py-16 px-4">
                {!ganadores ? (
                    <>
                        <div className="flex justify-center mb-12">
                            <Data {...props} />
                        </div>

                        {/* Formulario de opciones */}
                        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Opciones del sorteo</h2>

                            <div className="grid grid-cols-1 gap-6">
                                {/* Nº de ganadores */}
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

                                {/* Nº de suplentes */}
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

                                {/* Permitir autores duplicados */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="permitir_autores_duplicados"
                                        id="permitir_autores_duplicados"
                                        checked={formData.permitir_autores_duplicados}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="permitir_autores_duplicados">Permitir usuarios duplicados (mismo usuario con comentarios distintos)</label>
                                </div>

                                {/* Hashtag */}
                                <div>
                                    <label htmlFor="hashtag" className="block mb-1 font-medium">Filtrar por palabra o #hashtag</label>
                                    <input
                                        type="text"
                                        name="hashtag"
                                        id="hashtag"
                                        placeholder="#hashtag"
                                        value={formData.hashtag}
                                        onChange={handleChange}
                                        className="input w-full"
                                    />
                                </div>

                                {/* Mención */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="mencion"
                                        id="mencion"
                                        checked={formData.mencion}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="mencion">Solo comentarios que mencionen a un amigo</label>
                                </div>

                                {/* Participantes extra */}
                                <div>
                                    <label htmlFor="participantes_manuales" className="block mb-1 font-medium">Añadir participantes</label>
                                    <textarea
                                        name="participantes_manuales"
                                        id="participantes_manuales"
                                        placeholder="Lista de participantes que quieres añadir además de los comentarios"
                                        value={formData.participantes_manuales}
                                        onChange={handleChange}
                                        className="input w-full"
                                    />
                                </div>

                                {/* Usuarios excluidos */}
                                <div>
                                    <label htmlFor="usuarios_excluidos" className="block mb-1 font-medium">Excluir usuarios</label>
                                    <textarea
                                        name="usuarios_excluidos"
                                        id="usuarios_excluidos"
                                        placeholder="Lista de usuarios que quieres excluir de los comentarios"
                                        value={formData.usuarios_excluidos}
                                        onChange={handleChange}
                                        className="input w-full"
                                    />
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

                        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
                            <Comentarios />
                        </div>
                    </>
                ) : (
                    <Ganadores ganadores={ganadores} tipo={props.tipo} />

                )}
            </div>
        </>
    );
}

Sorteo.layout = (page) => <MainLayout>{page}</MainLayout>;
