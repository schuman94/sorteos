import MainLayout from '@/Layouts/MainLayout';
import Publicacion from '@/Components/Publicacion/Publicacion';
import Comentarios from '@/Components/Publicacion/Comentarios';
import Ganadores from '@/Components/Sorteo/Ganadores';
import CuentaRegresiva from '@/Components/Sorteo/CuentaRegresiva';
import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { SlidersHorizontal, Sparkles, ChevronDown } from 'lucide-react';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import Checkbox from '@/Components/Checkbox';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

export default function Sorteo({ publicacion }) {
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
    const [errores, setErrores] = useState({});
    const [mostrarOpciones, setMostrarOpciones] = useState(true);

    const [mostrarConfetti, setMostrarConfetti] = useState(false);
    const [width, height] = useWindowSize();

    const validarFormulario = () => {
        const erroresTemp = {};
        if (formData.num_ganadores < 1) erroresTemp.num_ganadores = 'Debe haber al menos un ganador.';
        if (formData.num_suplentes < 0) erroresTemp.num_suplentes = 'El número de suplentes no puede ser negativo.';
        if (formData.cuenta_regresiva < 3 || formData.cuenta_regresiva > 15) erroresTemp.cuenta_regresiva = 'La cuenta atrás debe estar entre 3 y 15 segundos.';
        setErrores(erroresTemp);
        return Object.keys(erroresTemp).length === 0;
    };

    useEffect(() => {
        if (cuentaRegresiva !== null && cuentaRegresiva > 0) {
            const timer = setTimeout(() => {
                setCuentaRegresiva(cuentaRegresiva - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
        if (cuentaRegresiva === 0) {
            setMostrarConfetti(true);
            setMostrarGanadores(true);
        }
    }, [cuentaRegresiva]);

    // Eliminar de localStorage la url, ya no la necesitamos, estamos autenticados
    useEffect(() => {
        localStorage.removeItem('url_pendiente');
    }, []);


    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const iniciarSorteo = async () => {
        if (!validarFormulario()) return;

        setCargando(true);
        try {
            const response = await axios.post(route('sorteo.iniciar'), formData);
            setGanadores(response.data.ganadores);
            setUrlHost(response.data.urlHost);
            setCuentaRegresiva(formData.cuenta_regresiva || 5);
            setMostrarGanadores(false);
        } catch (error) {
            console.error("Error al iniciar el sorteo:", error);
            const msg = error.response?.data?.error || error.response?.data?.message || 'Ocurrió un error al iniciar el sorteo';
            alert(msg);
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            <Head title="Sorteo" />
            {mostrarConfetti && <Confetti width={width} height={height} />}
            <div className="min-h-screen bg-gray-50 dark:bg-black text-black/70 dark:text-white/70 py-16 px-4">
                {!ganadores ? (
                    <>
                        <div className="flex justify-center mb-12">
                            <Publicacion {...publicacion} />
                        </div>

                        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                            {/* Cabecera desplegable */}
                            <div
                                className="bg-[#1cc2b5] px-6 py-5 flex items-center justify-between cursor-pointer"
                                onClick={() => setMostrarOpciones(!mostrarOpciones)}
                            >
                                <div className="flex items-center gap-3">
                                    <SlidersHorizontal className="w-7 h-7 text-white" />
                                    <h2 className="text-3xl font-semibold text-white">Opciones del Sorteo</h2>
                                </div>
                                <ChevronDown
                                    className={`w-6 h-6 text-white transition-transform ${mostrarOpciones ? 'rotate-180' : 'rotate-0'}`}
                                />
                            </div>

                            {/* Contenido colapsable */}
                            <div
                                className={`transition-opacity transition-transform duration-300 ease-in-out ${mostrarOpciones
                                    ? 'opacity-100 translate-y-0 pointer-events-auto p-6 space-y-6'
                                    : 'opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden'
                                    }`}
                            >

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
                                                className="w-full px-4 py-2 border-[1.5px] border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                                            />
                                            {errores[field.id] && <p className="text-red-600 text-sm mt-1">{errores[field.id]}</p>}
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                    {[
                                        { id: "permitir_autores_duplicados", label: "Permitir usuarios duplicados (mismo usuario con comentarios distintos)" },
                                        { id: "mencion", label: "Solo comentarios que mencionen a un amigo" }
                                    ].map((field, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer select-none">
                                            <Checkbox
                                                name={field.id}
                                                checked={formData[field.id]}
                                                onChange={handleChange}
                                            />
                                            <span>{field.label}</span>
                                        </label>
                                    ))}
                                </div>


                                <div>
                                    <label htmlFor="hashtag" className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                                        Filtrar por palabra o #hashtag
                                    </label>
                                    <input
                                        type="text"
                                        name="hashtag"
                                        id="hashtag"
                                        value={formData.hashtag}
                                        onChange={handleChange}
                                        placeholder="#hashtag"
                                        className="w-full px-4 py-2 border-[1.5px] border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { id: "participantes_manuales", label: "Añadir participantes", placeholder: "Lista de participantes manuales..." },
                                        { id: "usuarios_excluidos", label: "Excluir usuarios", placeholder: "Lista de usuarios a excluir..." }
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <label htmlFor={field.id} className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
                                                {field.label}
                                            </label>
                                            <textarea
                                                name={field.id}
                                                id={field.id}
                                                value={formData[field.id]}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                className="w-full px-4 py-2 border-[1.5px] border-[#1cc2b5] rounded-md bg-white text-gray-800 min-h-[140px] resize-y focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-center">
                                    <BotonPrimario onClick={iniciarSorteo} disabled={cargando} className="mt-4 flex items-center justify-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        {cargando ? 'Iniciando...' : 'Iniciar Sorteo'}
                                    </BotonPrimario>
                                </div>
                            </div>
                        </div>

                        <Comentarios />

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
