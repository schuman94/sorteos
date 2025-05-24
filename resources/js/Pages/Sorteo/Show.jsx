import MainLayout from '@/Layouts/MainLayout';
import Ganadores from '@/Components/Sorteo/Ganadores';
import Filtro from '@/Components/Sorteo/Filtro';
import ModalEliminacion from '@/Components/ModalEliminacion';
import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { formatearFecha as ff } from '@/utils/fecha';

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
            <Head title="Sorteo" />

            <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
                {/* Caja principal estilo SorteoCard */}
                <div className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
                    {/* Cabecera turquesa */}
                    <div className="bg-[#1cc2b5] px-5 py-2 flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-semibold text-white break-words line-clamp-2">
                            <a
                                href={sorteo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                            >
                                {sorteo.titulo || 'Sin título'}
                            </a>
                        </h2>
                    </div>

                    {/* Detalles */}
                    <div className="p-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        <p><strong>Fecha:</strong> {ff(sorteo.created_at)}</p>
                        <p><strong>Participantes:</strong> {sorteo.num_participantes}</p>
                        <p><strong>Tipo:</strong> {sorteo.tipo.split('\\').pop()}</p>
                        <p>
                            <strong>Certificado:</strong>{' '}
                            <a
                                href={`/certificado/${sorteo.certificado}`}
                                className="text-[#1cc2b5] hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {sorteo.certificado}
                            </a>
                        </p>
                    </div>
                </div>

                {sorteo.filtro && <Filtro filtro={sorteo.filtro} />}

                {/* Botones de acción */}
                {isOwner && (
                    <div className="flex flex-col sm:flex-row gap-4">
                        {hayGanadoresTitulares && (
                            <button
                                onClick={handleEnviarARuleta}
                                className="bg-[#1cc2b5] hover:bg-[#17b0a6] text-white font-semibold py-2 px-4 rounded transition-colors duration-200 shadow-sm"
                            >
                                Enviar a ruleta
                            </button>
                        )}

                        <button
                            onClick={() => setConfirmarVisible(true)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                        >
                            Eliminar sorteo
                        </button>
                    </div>
                )}

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
