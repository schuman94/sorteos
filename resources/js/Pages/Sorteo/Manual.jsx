import MainLayout from '@/Layouts/MainLayout';
import Ganadores from '@/Components/Sorteo/Ganadores';
import CuentaRegresiva from '@/Components/Sorteo/CuentaRegresiva';
import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ScrollText, Gift } from 'lucide-react';
import BotonPrimario from '@/Components/Botones/BotonPrimario';

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
        const lineas = formData.participantes
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        if (formData.eliminar_duplicados) {
            return [...new Set(lineas)].length;
        }

        return lineas.length;
    };

    const validarFormulario = () => {
        const erroresTemp = {};
        if (!formData.nombre.trim()) erroresTemp.nombre = 'El nombre del sorteo es obligatorio.';
        if (formData.num_ganadores < 1) erroresTemp.num_ganadores = 'Debe haber al menos un ganador.';
        if (formData.num_suplentes < 0) erroresTemp.num_suplentes = 'El número de suplentes no puede ser negativo.';
        if (formData.cuenta_regresiva < 3 || formData.cuenta_regresiva > 15) erroresTemp.cuenta_regresiva = 'La cuenta atrás debe estar entre 3 y 15 segundos.';

        const totalGanadores = parseInt(formData.num_ganadores) + parseInt(formData.num_suplentes);
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
                    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        {/* Header con fondo y título */}
                        <div className="bg-[#1cc2b5] px-6 py-5 flex items-center gap-3">
                            <ScrollText className="w-8 h-8 text-white" />
                            <h2 className="text-3xl font-semibold text-white">Sorteo Manual</h2>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Campo nombre */}
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nombre del sorteo
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border-[1.5px] border-[#1cc2b5] rounded-md bg-white text-gray-800
    focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"

                                    placeholder="Nombre del sorteo"
                                />
                                {errores.nombre && <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>}
                            </div>



                            {/* Campos numéricos */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {[
                                    { id: "num_ganadores", label: "Nº de ganadores", min: 1 },
                                    { id: "num_suplentes", label: "Nº de suplentes", min: 0 },
                                    { id: "cuenta_regresiva", label: "Cuenta atrás", min: 3, max: 15 }
                                ].map((field, i) => (
                                    <div className="flex-1" key={i}>
                                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {field.label}
                                        </label>
                                        <input
                                            type="number"
                                            name={field.id}
                                            id={field.id}
                                            min={field.min}
                                            max={field.max}
                                            value={formData[field.id]}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border-[1.5px] border-[#1cc2b5] rounded-md bg-white text-gray-800
    focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"

                                        />
                                        {errores[field.id] && <p className="text-red-600 text-sm mt-1">{errores[field.id]}</p>}
                                    </div>
                                ))}
                            </div>

                            {/* Participantes */}
                            <div>
                                <label htmlFor="participantes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Participantes
                                </label>
                                <textarea
                                    name="participantes"
                                    id="participantes"
                                    placeholder="Un nombre por línea"
                                    value={formData.participantes}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 min-h-[140px] resize-y
    focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"

                                />
                                {errores.participantes && <p className="text-red-600 text-sm mt-1">{errores.participantes}</p>}
                            </div>

                            {/* Checkbox */}
                            <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="eliminar_duplicados"
                                    checked={formData.eliminar_duplicados}
                                    onChange={handleChange}
                                    className="sr-only"
                                    id="eliminar_duplicados"
                                />
                                <div
                                    className={`w-5 h-5 flex items-center justify-center rounded-md border transition
            ${formData.eliminar_duplicados ? 'bg-[#1cc2b5] border-[#1cc2b5]' : 'border-[#1cc2b5] bg-white'}
        `}
                                >
                                    {formData.eliminar_duplicados && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span>Eliminar nombres duplicados</span>
                            </label>


                            {/* Botón */}
                            <div className="flex justify-center">
                                <BotonPrimario onClick={iniciarSorteo} disabled={cargando}>
                                    <Gift className="w-4 h-4" />
                                    {cargando ? 'Iniciando...' : 'Iniciar Sorteo'}
                                </BotonPrimario>
                            </div>
                        </div>
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
