import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Paginacion from '@/Components/Paginacion';
import ModalEliminacion from '@/Components/ModalEliminacion';
import { formatearFecha as ff } from '@/utils/fecha';

export default function Index({ publicaciones, coleccion }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState(null);

    const confirmarEliminacion = (id) => {
        setIdAEliminar(id);
        setModalVisible(true);
    };

    const cancelarEliminacion = () => {
        setModalVisible(false);
        setIdAEliminar(null);
    };

    const eliminar = () => {
        if (!idAEliminar) return;
        router.delete(route('publicaciones.destroy', idAEliminar), {
            onSuccess: () => cancelarEliminacion(),
        });
    };

    const cambiarPagina = (url) => {
        router.get(url, { coleccion_id: coleccion.id }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <Head title="Publicaciones Programadas" />
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Tus publicaciones programadas</h1>

                {publicaciones.data.length === 0 ? (
                    <p className="text-gray-500">No hay publicaciones programadas.</p>
                ) : (
                    <div className="space-y-4">
                        {publicaciones.data.map((pub) => (
                            <div key={pub.id} className="border rounded p-4 shadow-sm bg-white">
                                <p className="text-sm text-gray-600">
                                    Programada para:{' '}
                                    <strong>{ff(pub.fecha_programada)}</strong>
                                </p>
                                <p className="mt-2 whitespace-pre-wrap">{pub.mensaje}</p>

                                <div className="mt-4 text-right">
                                    <button
                                        onClick={() => confirmarEliminacion(pub.id)}
                                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}

                        <Paginacion links={publicaciones.links} onPageChange={cambiarPagina} />
                    </div>
                )}
            </div>

            <ModalEliminacion
                visible={modalVisible}
                mensaje="Esta acción no se puede deshacer."
                onConfirmar={eliminar}
                onCancelar={cancelarEliminacion}
            />
        </>
    );
}

Index.layout = (page) => <MainLayout children={page} />;
