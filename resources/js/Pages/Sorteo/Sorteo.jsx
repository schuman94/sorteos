import MainLayout from '@/Layouts/MainLayout';
import Data from '@/Components/Publicacion/Data';
import Comentarios from '@/Components/Publicacion/Comentarios';
import Ganadores from '@/Components/Sorteo/Ganadores';
import CuentaRegresiva from '@/Components/Sorteo/CuentaRegresiva';
import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Sorteo(props) {
    const [formData, setFormData] = useState({
        num_ganadores: 1,
        num_suplentes: 0,
        permitir_autores_duplicados: false,
        hashtag: '',
        mencion: false,
        participantes_manuales: '',
        usuarios_excluidos: '',
        cuenta_regresiva: 5,
    });

    const [urlHost, setUrlHost] = useState('');
    const [cargando, setCargando] = useState(false);
    const [ganadores, setGanadores] = useState(null);
    const [mostrarGanadores, setMostrarGanadores] = useState(false);
    const [cuentaRegresiva, setCuentaRegresiva] = useState(null);

    useEffect(() => {
        if (cuentaRegresiva !== null && cuentaRegresiva > 0) {
            const timer = setTimeout(() => {
                setCuentaRegresiva(cuentaRegresiva - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }

        if (cuentaRegresiva === 0) {
            setMostrarGanadores(true);
        }
    }, [cuentaRegresiva]);

    const handleChange = (e) => {
        // Desestructuracion de objeto: declaramos las variables name, type, value y checked y les damos su valor correspondiente del input.
        const { name, type, value, checked } = e.target;
        // La funcion set creada con useState recibe como parametro un objeto, ya que ese es el tipo de dato de la variable formData.
        setFormData({ // Forma abreviada de React para indicar el objeto con el valor actualizado.
            ...formData, // Se crea una copia del objeto
            [name]: type === 'checkbox' ? checked : value, // y se modifica solo la propiedad que nos interesa mediante una asignación automatica de [clave]: valor.
            // La variable name contiene el nombre de la propiedad y la variable value contiene el nuevo valor del input.
            // El operador terciario es por si se trata de un campo de tipo checkbox, en este caso no se asigna value, sino checked.
        });
    };

    const iniciarSorteo = async () => {
        setCargando(true);
        try {
            const response = await axios.post(route('sorteo.iniciar'), formData);
            setGanadores(response.data.ganadores);
            setUrlHost(response.data.urlHost);
            setCuentaRegresiva(formData.cuenta_regresiva || 5);
            setMostrarGanadores(false);
        } catch (error) {
            console.error("Error al iniciar el sorteo:", error);

            if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Ocurrió un error al iniciar el sorteo');
            }
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

                                {/* Cuenta regresiva */}
                                <div>
                                    <label htmlFor="cuenta_regresiva" className="block mb-1 font-medium">Cuenta regresiva (segundos)</label>
                                    <input
                                        type="number"
                                        name="cuenta_regresiva"
                                        id="cuenta_regresiva"
                                        min={3}
                                        max={15}
                                        value={formData.cuenta_regresiva || 5}
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
                ) : !mostrarGanadores ? (
                    <CuentaRegresiva
                        segundos={cuentaRegresiva}
                        onComplete={() => setMostrarGanadores(true)}
                    />
                ) : (
                    <Ganadores ganadores={ganadores} urlHost={urlHost} />
                )}
            </div>
        </>
    );
}

Sorteo.layout = (page) => <MainLayout>{page}</MainLayout>;
