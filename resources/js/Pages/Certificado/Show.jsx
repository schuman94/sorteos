import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { formatearFecha as ff } from '@/utils/fecha';

export default function CertificadoShow({ sorteo }) {
    const ganadoresTitulares = sorteo.ganadores.filter(g => g.clasificacion === 'titular');
    const ganadoresSuplentes = sorteo.ganadores.filter(g => g.clasificacion === 'suplente');

    return (
        <>
            <Head title="Certificado de Sorteo" />

            <div className="min-h-screen bg-gray-50 dark:bg-black text-black/70 dark:text-white/70 py-16 px-4">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded shadow space-y-8">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Certificado del Sorteo</h1>
                        <p className="text-sm text-gray-500">
                            Código: <strong>{sorteo.codigo_certificado}</strong>
                        </p>

                        {sorteo.url ? (
                            <a
                                href={sorteo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline block"
                            >
                                {sorteo.titulo}
                            </a>
                        ) : (
                            <p className="text-gray-500 italic">Sorteo Manual</p>
                        )}
                    </div>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p><strong>Fecha:</strong> {ff(sorteo.created_at)}</p>
                        <p><strong>Participantes:</strong> {sorteo.num_participantes}</p>
                    </div>

                    <div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 dark:text-white mb-2">Ganadores</h3>
                                <ol className="space-y-1 list-decimal list-inside text-sm">
                                    {ganadoresTitulares.map((g) => (
                                        <li key={`titular-${g.posicion}`}>
                                            {g.nombre}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-700 dark:text-white mb-2">Suplentes</h3>
                                {ganadoresSuplentes.length > 0 ? (
                                    <ol className="space-y-1 list-decimal list-inside text-sm">
                                        {ganadoresSuplentes.map((g) => (
                                            <li key={`suplente-${g.posicion}`}>
                                                {g.nombre}
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p className="italic text-gray-500">No hay suplentes</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

CertificadoShow.layout = (page) => <MainLayout>{page}</MainLayout>;
