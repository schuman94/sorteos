import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ rasca }) {
    const [processing, setProcessing] = useState(false);
    const [revelado, setRevelado] = useState(!!rasca.scratched_at);
    const [resultado, setResultado] = useState(rasca.scratched_at ? (!!rasca.premio ? 'premio' : 'no-premio') : null);

    const handleRascar = () => {
        if (processing || revelado) return;
        setProcessing(true);

        router.put(route('rascas.rascar', rasca.codigo), {}, {
            preserveScroll: true,
            onSuccess: (page) => {
                const actualizado = page.props.rasca;
                const haGanado = !!actualizado?.premio;
                setResultado(haGanado ? 'premio' : 'no-premio');
                setRevelado(true);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Rasca" />
            <style>
                {`
                @keyframes scratchFade {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }

                @keyframes textReveal {
                    0% {
                        opacity: 0;
                        filter: blur(4px);
                    }
                    100% {
                        opacity: 1;
                        filter: blur(0);
                    }
                }

                .animate-scratch-fade {
                    animation: scratchFade 1.2s ease-in-out forwards;
                }

                .animate-text-reveal {
                    animation: textReveal 1.2s ease-out forwards;
                }
                `}
            </style>

            <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">

                <h1 className="text-2xl font-bold text-center text-gray-800">¡Rasca!</h1>

                {/* Tarjeta principal */}
                <div className="bg-white border rounded-lg shadow p-6 space-y-6">
                    <div className="space-y-2">
                        <p><strong>Colección:</strong> {rasca.coleccion.nombre}</p>
                        <p><strong>Rascas totales:</strong> {rasca.coleccion.total_rascas}</p>
                    </div>

                    <table className="min-w-full border text-sm">
                        <thead className="bg-[#1cc2b5] text-white">
                            <tr>
                                <th className="border px-3 py-2 text-left">Premio</th>
                                <th className="border px-3 py-2 text-right">Cantidad</th>
                                <th className="border px-3 py-2 text-right">Probabilidad (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rasca.coleccion.premios.map((p, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2">
                                        {p.link ? (
                                            <a
                                                href={p.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline hover:text-blue-800"
                                            >
                                                {p.nombre}
                                            </a>
                                        ) : (
                                            p.nombre
                                        )}
                                    </td>
                                    <td className="border px-3 py-2 text-right">{p.cantidad}</td>
                                    <td className="border px-3 py-2 text-right">{p.probabilidad.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    {/* Zona de rasca */}
                    <div className="relative w-full border border-gray-300 rounded-md shadow-inner overflow-hidden bg-white">
                        <div className={`p-6 text-center space-y-2 relative z-10 h-[240px] overflow-y-auto ${revelado && !rasca.scratched_at ? 'animate-text-reveal' : ''
                            }`}>
                            {rasca.scratched_at || revelado ? (
                                rasca.es_propietario ? (
                                    resultado === 'premio' ? (
                                        <>
                                            <h2 className="text-xl font-semibold text-[#1cc2b5]">¡Premiado!</h2>
                                            <p><strong>Has ganado:</strong> {rasca.premio.nombre}</p>
                                            <p>{rasca.premio.descripcion}</p>
                                            <p><strong>Proveedor:</strong> {rasca.premio.proveedor}</p>
                                            {rasca.premio.link && (
                                                <p>
                                                    <a
                                                        href={rasca.premio.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        Ver premio
                                                    </a>
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <p className="italic text-gray-700">Este rasca no ha sido premiado.</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-600 italic">Este rasca ya ha sido rascado por otro usuario.</p>
                                    </div>
                                )
                            ) : !rasca.coleccion.abierta ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-600 italic">Esta colección está cerrada.</p>
                                </div>
                            ) : null}
                        </div>

                        {!revelado && rasca.coleccion.abierta && (
                            <div
                                onClick={handleRascar}
                                className="absolute inset-0 bg-gray-300 cursor-pointer z-20"
                            />
                        )}

                        {revelado && (
                            <div className="absolute inset-0 bg-gray-300 z-20 animate-scratch-fade pointer-events-none" />
                        )}
                    </div>
                </div>

                {/* Instrucciones al final */}
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-lg shadow text-sm">
                    <p><strong>Instrucciones:</strong></p>
                    <ul className="list-disc list-inside">
                        <li>Pulsa la zona gris para descubrir si has ganado algún premio.</li>
                        <li>Si has ganado, recibirás un correo automático con toda la información.</li>
                        <li>El creador de la colección contactará contigo para gestionar el premio. </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

Show.layout = page => <MainLayout>{page}</MainLayout>;
