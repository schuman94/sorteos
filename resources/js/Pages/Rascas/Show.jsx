import MainLayout from '@/Layouts/MainLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ rasca }) {
    const [processing, setProcessing] = useState(false);

    const handleRascar = () => {
        setProcessing(true);
        router.put(route('rascas.rascar', rasca.codigo), {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Rasca" />

            <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Rasca</h1>

                <div className="bg-white border rounded shadow p-6 space-y-4">
                    <p><strong>Colección:</strong> {rasca.coleccion.nombre}</p>
                    <p><strong>Rascas totales:</strong> {rasca.coleccion.total_rascas}</p>

                    <table className="min-w-full border text-sm mt-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2 text-left">Premio</th>
                                <th className="border px-3 py-2 text-right">Cantidad</th>
                                <th className="border px-3 py-2 text-right">Probabilidad (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rasca.coleccion.premios.map((p, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2">{p.nombre}</td>
                                    <td className="border px-3 py-2 text-right">{p.cantidad}</td>
                                    <td className="border px-3 py-2 text-right">{p.probabilidad.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 text-center shadow-inner relative">
                    <p className="text-sm text-gray-600 mb-2">Código: {rasca.codigo}</p>

                    {rasca.scratched_at ? (
                        rasca.es_propietario ? (
                            <div className="space-y-2">
                                {rasca.premio ? (
                                    <>
                                        <h2 className="text-xl font-semibold text-green-600">¡Premiado!</h2>
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
                                    <p className="italic text-gray-700">Este rasca no ha sido premiado.</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-600 italic">
                                Este rasca ya ha sido rascado por otro usuario.
                            </p>
                        )
                    ) : !rasca.coleccion.abierta ? (
                        <p className="text-red-600 font-semibold">Esta colección está cerrada. No se puede rascar.</p>
                    ) : (
                        <button
                            onClick={handleRascar}
                            disabled={processing}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-full text-lg shadow transition"
                        >
                            {processing ? 'Rascando...' : '✨ Rascar ✨'}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

Show.layout = page => <MainLayout>{page}</MainLayout>;
