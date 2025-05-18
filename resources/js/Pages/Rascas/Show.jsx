import MainLayout from '@/Layouts/MainLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { formatearFecha as ff } from '@/utils/fecha';
import { useState } from 'react';

export default function Show({ rasca }) {
    const { props } = usePage();
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
                <h1 className="text-2xl font-bold text-center mb-4">Rasca</h1>

                {/* Mensajes de estado */}
                {props.success && (
                    <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded">
                        {props.success}
                    </div>
                )}
                {props.warning && (
                    <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-2 rounded">
                        {props.warning}
                    </div>
                )}
                {props.info && (
                    <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded">
                        {props.info}
                    </div>
                )}

                <div className="bg-white rounded shadow p-6 space-y-4">
                    <div>
                        <strong>Colección:</strong> {rasca.coleccion.nombre}
                    </div>

                    <div>
                        <strong>Código:</strong> {rasca.codigo}
                    </div>

                    {rasca.scratched_at && (
                        <div>
                            <span className="text-green-600 font-semibold">
                                Rascado: {ff(rasca.scratched_at)}
                            </span>
                        </div>
                    )}

                    {!rasca.scratched_at && (
                        <div>
                            <button
                                onClick={handleRascar}
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                {processing ? 'Rascando...' : 'Rascar'}
                            </button>
                        </div>
                    )}

                    {/* Resultado tras rascar */}
                    {rasca.scratched_at && (
                        <div className="mt-6 border-t pt-4">
                            {rasca.premio ? (
                                <>
                                    <h2 className="text-lg font-bold text-blue-600">¡Premio obtenido!</h2>
                                    <p><strong>Nombre:</strong> {rasca.premio.nombre}</p>
                                    <p><strong>Descripción:</strong> {rasca.premio.descripcion}</p>
                                    <p><strong>Proveedor:</strong> {rasca.premio.proveedor}</p>
                                    {rasca.premio.link && (
                                        <p>
                                            <strong>Enlace:</strong>{' '}
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
                                <p className="text-gray-600 italic">Este rasca no ha sido premiado.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Show.layout = page => <MainLayout>{page}</MainLayout>;
