import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router, usePage } from '@inertiajs/react';
import Ganadores from '@/Components/Sorteo/Ganadores';
import Filtro from '@/Components/Sorteo/Filtro';
import ModalEliminacion from '@/Components/ModalEliminacion';

export default function Show({ sorteo }) {
    const { auth } = usePage().props;
    const isOwner = auth.user.id === sorteo.user_id;

    const [confirmarVisible, setConfirmarVisible] = useState(false);

    const handleDelete = () => {
        router.delete(route('sorteo.destroy', sorteo.id));
    };

    const handleEnviarARuleta = () => {
        router.visit(route('ruleta', { sorteo: sorteo.id }));
    };

    const hayGanadoresTitulares = sorteo.ganadores.some(g => !g.es_suplente);

    return (
        <>
            <Head title={`Sorteo`} />

            <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white break-words mb-4">
                        <a
                            href={sorteo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {sorteo.titulo}
                        </a>
                    </h2>

                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p><strong>Fecha:</strong> {new Date(sorteo.created_at).toLocaleString()}</p>
                        <p><strong>Participantes:</strong> {sorteo.num_participantes}</p>
                        <p><strong>Tipo:</strong> {sorteo.tipo.split('\\').pop()}</p>
                        <p>
                            <strong>Certificado:</strong>{' '}
                            <a
                                href={`/certificado/${sorteo.certificado}`}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {sorteo.certificado}
                            </a>
                        </p>
                    </div>
                </div>

                {sorteo.filtro && <Filtro filtro={sorteo.filtro} />}

                <div className="flex flex-col sm:flex-row gap-4">
                    {isOwner && (
                        <>
                            <button
                                onClick={() => setConfirmarVisible(true)}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                Eliminar sorteo
                            </button>

                            {hayGanadoresTitulares && (
                                <button
                                    onClick={handleEnviarARuleta}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Enviar a ruleta
                                </button>
                            )}
                        </>
                    )}
                </div>

                <Ganadores ganadores={sorteo.ganadores} urlHost={sorteo.urlHost} />
            </div>

            <ModalEliminacion
                visible={confirmarVisible}
                titulo="¿Eliminar sorteo?"
                mensaje="¿Seguro de que deseas eliminar este sorteo? Esta acción no se puede deshacer."
                onCancelar={() => setConfirmarVisible(false)}
                onConfirmar={handleDelete}
            />
        </>
    );
}

Show.layout = (page) => <MainLayout>{page}</MainLayout>;
