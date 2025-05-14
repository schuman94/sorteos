import MainLayout from '@/Layouts/MainLayout';
import ModalGuardarRuleta from '@/Components/Ruleta/ModalGuardarRuleta';
import ModalCargarRuleta from '@/Components/Ruleta/ModalCargarRuleta';
import ModalGanador from '@/Components/Ruleta/ModalGanador';
import axios from '@/lib/axios';
import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Wheel } from 'react-custom-roulette';
import { jsonToWheel, jsonToText } from '@/utils/ruleta';

export default function Ruleta({ opcionesPrecargadas }) {
    const user = usePage().props.auth?.user;

    const [input, setInput] = useState(
        jsonToText(opcionesPrecargadas) // En el textarea aparece una por linea
    );

    const [opciones, setOpciones] = useState(
        jsonToWheel(opcionesPrecargadas) // Formato para Wheel
    );

    const nuevaRuleta = () => {
        setInput('');
        setOpciones([]);
        setRuletaCargada(null);
        setGanador(null);
    };

    const cargarRuleta = (ruleta) => {
        setRuletaCargada(ruleta);
        setInput(jsonToText(ruleta.opciones));
        setOpciones(jsonToWheel(ruleta.opciones));
        setGanador(null);
    };

    const [mustSpin, setMustSpin] = useState(false);
    const [premioIndex, setPremioIndex] = useState(0);
    const [ganador, setGanador] = useState(null);
    const [mostrarModalGanador, setMostrarModalGanador] = useState(false);

    const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);
    const [mostrarModalCargar, setMostrarModalCargar] = useState(false);
    const [ruletaCargada, setRuletaCargada] = useState(null);

    const girarRuleta = () => {
        if (opciones.length === 0) return;
        const indexAleatorio = Math.floor(Math.random() * opciones.length);
        setPremioIndex(indexAleatorio);
        setMustSpin(true);
    };

    const guardarRuleta = async (nombre, { onError, onSuccess } = {}) => {
        try {
            const response = await axios.post(route('ruletas.store'), {
                nombre,
                opciones: opciones.map(op => op.option),
            });

            const ruleta = response.data.ruleta;
            setRuletaCargada(ruleta);
            setInput(jsonToText(ruleta.opciones));
            setOpciones(jsonToWheel(ruleta.opciones));
            setMostrarModalGuardar(false);
            onSuccess?.();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                onError?.(error.response.data.errors);
            }
        }
    };


    const actualizarRuleta = async (nombre, { onError, onSuccess } = {}) => {
        try {
            const response = await axios.put(route('ruletas.update', ruletaCargada.id), {
                nombre,
                opciones: opciones.map(op => op.option),
            });

            const ruleta = response.data.ruleta;
            setRuletaCargada(ruleta);
            setInput(jsonToText(ruleta.opciones));
            setOpciones(jsonToWheel(ruleta.opciones));
            setMostrarModalGuardar(false);
            onSuccess?.();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 422) {
                onError?.(error.response.data.errors);
            }
        }
    };



    const coloresDisponibles = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#00A878', '#FF5E5B',
        '#3D348B', '#E4B363', '#2EC4B6', '#E71D36',
        '#F4D35E', '#0081A7', '#F07167', '#70C1B3',
        '#9B5DE5', '#00BBF9', '#00F5D4', '#F15BB5',
    ];
    const opcionesRuleta = opciones.length > 0 ? opciones : [{ option: '...' }, { option: '...' }];
    const opcionesVisuales = opciones.length > 0
    ? opciones.map(op => ({
        option: op.option.length > 20 ? op.option.slice(0, 17) + '...' : op.option
    }))
    : [{ option: '...' }, { option: '...' }];

    const backgroundColors = opcionesRuleta.map((_, i) => coloresDisponibles[i % coloresDisponibles.length]);

    return (
        <>
            <Head title="Ruleta" />

            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-8 text-center">
                    {ruletaCargada ? ruletaCargada.nombre : 'Ruleta aleatoria'}
                </h1>

                <div className="flex flex-col md:flex-row gap-32 justify-center items-start mb-8">
                    <textarea
                        className="w-full md:w-64 border rounded p-2 h-[500px] resize-none font-mono overflow-x-auto whitespace-pre text-sm"
                        value={input}
                        onChange={(e) => {
                            const valor = e.target.value;
                            setInput(valor);

                            const nuevasOpciones = valor
                                .split('\n') // separamos por salto de linea
                                .map((linea) => linea.trim()) // trimeamos espacios
                                .filter((linea) => linea.length > 0) // eliminamos lineas en blanco
                                .map((linea) => ({ option: linea})); // formato para Wheel

                            setOpciones(nuevasOpciones);
                        }}
                        placeholder="Una opción por línea"
                    />

                    <div className="flex flex-col items-center">
                        <Wheel
                            mustStartSpinning={mustSpin}
                            prizeNumber={premioIndex}
                            data={opcionesVisuales}
                            onStopSpinning={() => {
                                setMustSpin(false);
                                const opcionGanadora = opciones[premioIndex]?.option ?? null;
                                setGanador(opcionGanadora);
                                if (opcionGanadora) {
                                    setMostrarModalGanador(true);
                                }
                            }}
                            backgroundColors={backgroundColors}
                            textColors={['#ffffff']}
                            outerBorderWidth={1}
                            radiusLineWidth={0}
                            outerBorderColor="transparent"
                            radiusLineColor="transparent"
                            fontSize={14}
                        />

                        {user ? (
                            <div className="mt-4 flex gap-4">
                                <button onClick={nuevaRuleta} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Nueva</button>
                                <button onClick={() => setMostrarModalCargar(true)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Cargar</button>
                                <button onClick={() => setMostrarModalGuardar(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50" disabled={opciones.length < 1}>Guardar</button>
                                <button onClick={girarRuleta} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50" disabled={opciones.length < 2}>Girar</button>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <button onClick={girarRuleta} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50" disabled={opciones.length < 2}>Girar</button>
                            </div>
                        )}

                    </div>
                </div>

                <ModalGanador
                    visible={mostrarModalGanador}
                    ganador={ganador}
                    onClose={() => setMostrarModalGanador(false)}
                />

            </div>

            <ModalGuardarRuleta
                visible={mostrarModalGuardar}
                onClose={() => setMostrarModalGuardar(false)}
                ruletaCargada={ruletaCargada}
                onGuardarNueva={guardarRuleta}
                onActualizar={actualizarRuleta}
            />

            <ModalCargarRuleta
                visible={mostrarModalCargar}
                onClose={() => setMostrarModalCargar(false)}
                onSeleccionar={cargarRuleta}
                ruletaCargadaId={ruletaCargada?.id}
                onEliminarActual={() => {
                    setRuletaCargada(null);
                    setInput('');
                    setOpciones([]);
                    setGanador(null);
                }}
            />

        </>
    );
}

Ruleta.layout = (page) => <MainLayout>{page}</MainLayout>;
