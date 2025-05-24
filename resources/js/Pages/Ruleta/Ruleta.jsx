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

    // OpcionesVisuales es la variable que le pasamos a Wheel como data. Se recalcula a partir de opciones.
    // Adaptamos las opciones para que no se vean tan largas en la ruleta, acortando e incluyendo '...'
    // y para que si opciones está vacia aparezcan como "placeholder" tres opciones '...'
    const opcionesVisuales = opciones.length > 0
        ? opciones.map(op => ({
            option: op.option.length > 20 ? op.option.slice(0, 17) + '...' : op.option
        }))
        : [{ option: '...' }, { option: '...' }, { option: '...' }];

    const coloresDisponibles = [
        '#1cc2b5', // principal turquesa
        '#2e2b4a', // violeta oscuro
        '#FF6384', // rosa fuerte
        '#36A2EB', // azul claro
        '#9966FF', // violeta claro
        '#FF9F40', // naranja
        '#FF5E5B', // rojo coral
        '#3D348B', // púrpura intenso
        '#E4B363', // beige dorado
        '#E71D36', // rojo oscuro
        '#F4D35E', // amarillo claro suave
        '#F07167', // coral claro
        '#9B5DE5', // morado
        '#00BBF9', // celeste
        '#F15BB5', // rosa claro
        '#227C9D', // azul oscuro
        '#8D6A9F', // lila oscuro
        '#61C0BF', // verde pálido
        '#FFA69E', // rosado pastel
        '#FFCE56', // amarillo fuerte
    ];



    const backgroundColors = opcionesVisuales.map((_, i) => coloresDisponibles[i % coloresDisponibles.length]);

    const [ruletaCargada, setRuletaCargada] = useState(null);

    const nuevaRuleta = () => {
        setInput('');
        setOpciones([]);
        setRuletaCargada(null);
        setGanador(null);
    };

    // Cargar la ruleta seleccionada desde el modal
    const cargarRuleta = (ruleta) => {
        setRuletaCargada(ruleta);
        setInput(jsonToText(ruleta.opciones));
        setOpciones(jsonToWheel(ruleta.opciones));
        setGanador(null);
    };

    const [girando, setGirando] = useState(false);
    const [indiceGanador, setIndiceGanador] = useState(null);

    const [ganador, setGanador] = useState(null);
    const [mostrarModalGanador, setMostrarModalGanador] = useState(false);

    const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);
    const [mostrarModalCargar, setMostrarModalCargar] = useState(false);

    const girarRuleta = () => {
        if (opciones.length === 0) return;
        const numeroAleatorio = Math.floor(Math.random() * opciones.length);
        setIndiceGanador(numeroAleatorio);
        setGirando(true);
    };

    return (
        <>
            <Head title="Ruleta" />

            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white text-center mb-8">
                    {ruletaCargada ? ruletaCargada.nombre : 'Ruleta aleatoria'}
                </h1>

                <div className="flex flex-col md:flex-row gap-32 justify-center items-start mb-8">
                    <textarea
                        className="w-full md:w-64 h-[500px] px-4 py-2 border-[1.5px] border-[#1cc2b5] rounded-md bg-white text-gray-800 text-sm font-mono resize-none overflow-x-auto whitespace-pre disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                        value={input}
                        value={input}
                        onChange={(e) => {
                            const valor = e.target.value;
                            setInput(valor);

                            const nuevasOpciones = valor
                                .split('\n') // separamos por salto de linea
                                .map((linea) => linea.trim()) // trimeamos espacios
                                .filter((linea) => linea.length > 0) // eliminamos lineas en blanco
                                .map((linea) => ({ option: linea })); // formato para Wheel

                            setOpciones(nuevasOpciones);
                        }}
                        placeholder="Una opción por línea"
                        disabled={girando}
                    />

                    <div className="flex flex-col items-center">
                        <Wheel
                            mustStartSpinning={girando}
                            prizeNumber={indiceGanador}
                            data={opcionesVisuales}
                            onStopSpinning={() => {
                                setGirando(false);
                                const opcionGanadora = opciones[indiceGanador]?.option ?? null;
                                setGanador(opcionGanadora);
                                setMostrarModalGanador(true);
                                setIndiceGanador(null);
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
                            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                <button
                                    onClick={nuevaRuleta}
                                    disabled={girando}
                                    className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-[#1cc2b5] text-white font-semibold hover:bg-[#17b0a6] transition-colors duration-200 shadow-sm disabled:opacity-50"
                                >
                                    Nueva
                                </button>
                                <button
                                    onClick={() => setMostrarModalCargar(true)}
                                    disabled={girando}
                                    className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-[#2e2b4a] text-white font-semibold hover:bg-[#403d61] transition-colors duration-200 shadow-sm disabled:opacity-50"
                                >
                                    Cargar
                                </button>
                                <button
                                    onClick={() => setMostrarModalGuardar(true)}
                                    disabled={girando || opciones.length < 1}
                                    className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-[#FF6384] text-white font-semibold hover:bg-[#e55072] transition-colors duration-200 shadow-sm disabled:opacity-50"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={girarRuleta}
                                    disabled={girando || opciones.length < 2}
                                    className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-[#36A2EB] text-white font-semibold hover:bg-[#2d8bd3] transition-colors duration-200 shadow-sm disabled:opacity-50`}
                                >
                                    Girar
                                </button>

                            </div>
                        ) : (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={girarRuleta}
                                    disabled={girando || opciones.length < 2}
                                    className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-[#36A2EB] text-white font-semibold hover:bg-[#2d8bd3] transition-colors duration-200 shadow-sm disabled:opacity-50`}
                                >
                                    Girar
                                </button>

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
                opciones={opciones}
                onGuardado={(ruleta) => {
                    setRuletaCargada(ruleta);
                    setInput(jsonToText(ruleta.opciones));
                    setOpciones(jsonToWheel(ruleta.opciones));
                }}
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
