import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ModalEliminacion from '@/Components/ModalEliminacion';
import { formatearDinero as dinero } from '@/utils/dinero';
import { formatearFecha as ff } from '@/utils/fecha';
import BotonRojo from '@/Components/Botones/BotonRojo';
import { Gift } from 'lucide-react';

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

            <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Cabecera */}
                <div className="bg-[#1cc2b5] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Gift className="w-6 h-6 text-white" />
                        <h1 className="text-xl font-semibold text-white break-all">
                            {premio.nombre}
                        </h1>
                    </div>
                    <Link
                        href={route('premios.index')}
                        className="inline-block text-white font-medium text-sm hover:underline"
                    >
                        Gestionar premios
                    </Link>
                </div>
                {premio.imagen_url && (
                    <div className="relative w-full h-72 bg-black overflow-hidden">
                        {/* Fondo difuminado */}
                        <img
                            src={premio.imagen_url}
                            alt="Fondo"
                            className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-50"
                        />

                        {/* Imagen principal contenida */}
                        <img
                            src={premio.imagen_url}
                            alt={premio.nombre}
                            className="relative z-10 max-h-full max-w-full object-contain mx-auto h-full"
                        />
                    </div>
                )}
                {/* Cuerpo */}
                <div className="p-6 space-y-4 text-sm text-gray-800 dark:text-gray-200">
                    {errorEliminar && (
                        <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-300 text-sm">
                            {errorEliminar}
                        </div>
                    )}

                    <div>
                        <span className="font-semibold">Proveedor:</span> {premio.proveedor}
                    </div>
                    <div>
                        <span className="font-semibold">Valor:</span> {dinero(premio.valor)}
                    </div>
                    {premio.descripcion && (
                        <div>
                            <span className="font-semibold">Descripción:</span>{' '}
                            {premio.descripcion}
                        </div>
                    )}

                    {premio.link && (
                        <div>
                            <a
                                href={premio.link}
                                className="text-[#1cc2b5] underline hover:text-[#17b0a6]"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver enlace oficial
                            </a>
                        </div>
                    )}

                    <div>
                        <span className="font-semibold">Creado:</span> {ff(premio.created_at)}
                    </div>

                    {/* Botones */}
                    <div className="pt-4 border-t flex gap-4">
                        <Link
                            href={route('premios.edit', premio.id)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-[#1cc2b5] text-white font-semibold hover:bg-[#17b0a6] shadow-sm active:scale-95 transition-transform duration-100 ease-in-out"
                        >
                            Editar
                        </Link>

                        <BotonRojo onClick={() => setModalVisible(true)}>
                            Eliminar
                        </BotonRojo>
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
