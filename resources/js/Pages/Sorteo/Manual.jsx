import MainLayout from '@/Layouts/MainLayout';
import Ganadores from '@/Components/Sorteo/Ganadores';
import CuentaRegresiva from '@/Components/Sorteo/CuentaRegresiva';
import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Manual() {
    const [formData, setFormData] = useState({
        nombre: '',
        num_ganadores: 1,
        num_suplentes: 0,
        participantes: '',
        eliminar_duplicados: false,
        cuenta_regresiva: 5,
    });

    const [errores, setErrores] = useState({});
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
        const { name, type, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const contarParticipantes = () => {
        return formData.participantes
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0).length;
    };

    const validarFormulario = () => {
        const erroresTemp = {};

        if (!formData.nombre.trim()) {
            erroresTemp.nombre = 'El nombre del sorteo es obligatorio.';
        }

        if (formData.num_ganadores < 1) {
            erroresTemp.num_ganadores = 'Debe haber al menos un ganador.';
        }

        if (formData.num_suplentes < 0) {
            erroresTemp.num_suplentes = 'El número de suplentes no puede ser negativo.';
        }

        if (formData.cuenta_regresiva < 3 || formData.cuenta_regresiva > 15) {
            erroresTemp.cuenta_regresiva = 'La cuenta atrás debe estar entre 3 y 15 segundos.';
        }

        const suplentes = parseInt(formData.num_suplentes);
        const totalGanadores = parseInt(formData.num_ganadores) + (suplentes > 0 ? suplentes : 0);

        const totalParticipantes = contarParticipantes();

        if (totalGanadores > totalParticipantes) {
            erroresTemp.participantes = `Hay ${totalParticipantes} participantes pero se requieren al menos ${totalGanadores}.`;
        }

        setErrores(erroresTemp);
        return Object.keys(erroresTemp).length === 0;
    };

    const iniciarSorteo = async () => {
        if (!validarFormulario()) return;

        setCargando(true);
        try {
            const response = await axios.post(route('sorteo.manual.iniciar'), formData);
            setGanadores(response.data.ganadores);
            setCuentaRegresiva(formData.cuenta_regresiva || 5);
            setMostrarGanadores(false);
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

                        <div className="mb-6">
                            <label htmlFor="nombre" className="block mb-1 font-medium">
                                Nombre del sorteo
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                id="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="Nombre del sorteo"
                            />
                            {errores.nombre && <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>}
                        </div>

                        <div className="max-w-3xl mx-auto grid gap-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="num_ganadores" className="block mb-1 font-medium whitespace-nowrap">
                                        Nº de ganadores
                                    </label>
                                    <input
                                        type="number"
                                        name="num_ganadores"
                                        id="num_ganadores"
                                        min={1}
                                        value={formData.num_ganadores}
                                        onChange={handleChange}
                                        className="input w-full"
                                    />
                                    {errores.num_ganadores && <p className="text-red-600 text-sm mt-1">{errores.num_ganadores}</p>}
                                </div>

                                <div>
                                    <label htmlFor="num_suplentes" className="block mb-1 font-medium whitespace-nowrap">
                                        Nº de suplentes
                                    </label>
                                    <input
                                        type="number"
                                        name="num_suplentes"
                                        id="num_suplentes"
                                        min={0}
                                        value={formData.num_suplentes}
                                        onChange={handleChange}
                                        className="input w-full"
                                    />
                                    {errores.num_suplentes && <p className="text-red-600 text-sm mt-1">{errores.num_suplentes}</p>}
                                </div>

                                <div>
                                    <label htmlFor="cuenta_regresiva" className="block mb-1 font-medium whitespace-nowrap">
                                        Cuenta atrás
                                    </label>
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
                                    {errores.cuenta_regresiva && <p className="text-red-600 text-sm mt-1">{errores.cuenta_regresiva}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="participantes" className="block mb-1 font-medium">
                                    Participantes
                                </label>
                                <textarea
                                    name="participantes"
                                    id="participantes"
                                    placeholder="Un nombre por línea"
                                    value={formData.participantes}
                                    onChange={handleChange}
                                    className="input w-full min-h-[140px] resize-y"
                                />
                                {errores.participantes && <p className="text-red-600 text-sm mt-1">{errores.participantes}</p>}
                            </div>

                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="eliminar_duplicados"
                                        id="eliminar_duplicados"
                                        checked={formData.eliminar_duplicados}
                                        onChange={handleChange}
                                    />
                                    Eliminar nombres duplicados
                                </label>
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
                ) : !mostrarGanadores ? (
                    <CuentaRegresiva
                        segundos={cuentaRegresiva}
                        onComplete={() => setMostrarGanadores(true)}
                    />
                ) : (
                    <Ganadores ganadores={ganadores} urlHost={null} />
                )}
            </div>
        </>
    );
}

Manual.layout = (page) => <MainLayout>{page}</MainLayout>;
