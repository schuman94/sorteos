import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Paginacion from '@/Components/Paginacion';
import ModalEliminacion from '@/Components/ModalEliminacion';
import { formatearFecha as ff } from '@/utils/fecha';

export default function Index({ publicaciones, coleccion }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState(null);
    const [modoMasivo, setModoMasivo] = useState(false);

    const confirmarEliminacion = (id) => {
        setIdAEliminar(id);
        setModoMasivo(false);
        setModalVisible(true);
    };

    const confirmarEliminacionMasiva = () => {
        setModoMasivo(true);
        setModalVisible(true);
    };

    const cancelarEliminacion = () => {
        setModalVisible(false);
        setIdAEliminar(null);
        setModoMasivo(false);
    };

    const eliminar = () => {
        if (modoMasivo) {
            router.delete(route('publicaciones.eliminarTodas', coleccion.id), {
                onSuccess: cancelarEliminacion,
            });
        } else if (idAEliminar) {
            router.delete(route('publicaciones.destroy', idAEliminar), {
                onSuccess: cancelarEliminacion,
            });
        }
    };

    const cambiarPagina = (url) => {
        router.get(url, { coleccion_id: coleccion.id }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <>
            <Head title={'Publicaciones'} />
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 text-center">{coleccion.nombre}</h1>

                    {publicaciones.data.length > 0 && (
                        <button
                            onClick={confirmarEliminacionMasiva}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                            Eliminar todas
                        </button>
                    )}
                </div>

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
                mensaje={
                    modoMasivo
                        ? '¿Seguro que deseas eliminar todas las publicaciones programadas de esta colección? Esta acción no se puede deshacer.'
                        : 'Esta acción no se puede deshacer.'
                }
                onConfirmar={eliminar}
                onCancelar={cancelarEliminacion}
            />
        </>
    );
}

Index.layout = (page) => <MainLayout children={page} />;
