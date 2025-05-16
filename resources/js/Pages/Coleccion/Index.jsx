import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ colecciones }) {
    return (
        <>
            <Head title="Colecciones" />

            <div className="max-w-5xl mx-auto py-12 px-4">
                <h1 className="text-2xl font-semibold mb-6">Colecciones</h1>

                {/* Botones con separación */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => router.visit(route('colecciones.create'))}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Crear Colección
                    </button>

                    <button
                        onClick={() => router.visit(route('premios.index'))}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Gestionar premios
                    </button>
                </div>

                {/* Tarjetas de colecciones */}
                {colecciones.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {colecciones.map((coleccion) => (
                            <div
                                key={coleccion.id}
                                onClick={() => router.visit(route('colecciones.show', coleccion.id))}
                                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                                    {coleccion.nombre}
                                </h2>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                    {coleccion.descrpipcion}
                                </p>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                    Estado: {coleccion.abierta ? 'Abierta' : 'Cerrada'}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-8">No hay colecciones disponibles.</p>
                )}
            </div>
        </>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;
