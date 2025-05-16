import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ModalEliminacion from '@/Components/ModalEliminacion';

export default function Show({ premio }) {
    const { errors } = usePage().props;
    const [modalVisible, setModalVisible] = useState(false);
    const [errorEliminar, setErrorEliminar] = useState(null);

    const handleEliminar = () => {
        router.delete(route('premios.destroy', premio.id), {
            preserveScroll: true,
            onError: (err) => {
                if (err.premio) {
                    setErrorEliminar(err.premio);
                    setModalVisible(false);
                }
            },
        });
    };

    return (
        <>
            <Head title={`Premio: ${premio.nombre}`} />

            <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
                {/* Botón superior derecho */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">{premio.nombre}</h1>

                    <Link
                        href={route('premios.index')}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                        Gestionar premios
                    </Link>
                </div>

                {errorEliminar && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-300 text-sm">
                        {errorEliminar}
                    </div>
                )}

                {/* Recuadro de información con botones al final */}
                <div className="bg-white dark:bg-gray-800 shadow rounded p-6 space-y-4 text-sm">
                    <div>
                        <span className="font-semibold">Proveedor:</span> {premio.proveedor}
                    </div>
                    <div>
                        <span className="font-semibold">Valor:</span> {premio.valor} €
                    </div>
                    <div>
                        <span className="font-semibold">Descripción:</span>{' '}
                        {premio.descripcion || <span className="italic text-gray-400">Sin descripción</span>}
                    </div>
                    <div>
                        <span className="font-semibold">Link:</span>{' '}
                        {premio.link ? (
                            <a
                                href={premio.link}
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver enlace
                            </a>
                        ) : (
                            <span className="italic text-gray-400">No disponible</span>
                        )}
                    </div>
                    <div>
                        <span className="font-semibold">Creado:</span>{' '}
                        {new Date(premio.created_at).toLocaleString('es-ES')}
                    </div>

                    {/* Botones de acción dentro del recuadro */}
                    <div className="flex gap-2 pt-4 border-t">
                        <Link
                            href={route('premios.edit', premio.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            Editar
                        </Link>
                        <button
                            onClick={() => setModalVisible(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            <ModalEliminacion
                visible={modalVisible}
                titulo="¿Eliminar premio?"
                mensaje="¿Estás seguro de que deseas eliminar este premio? Esta acción no se puede deshacer."
                onCancelar={() => setModalVisible(false)}
                onConfirmar={handleEliminar}
            />
        </>
    );
}

Show.layout = (page) => <MainLayout>{page}</MainLayout>;
