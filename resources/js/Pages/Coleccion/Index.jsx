import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ colecciones }) {
    const handleClick = (e, coleccionId) => {
        if (e.target.closest('a')) return;

        router.visit(route('coleccion.show', coleccionId));
    };

    return (
        <>
            <Head title="Colecciones" />

            <div className="max-w-5xl mx-auto py-12 px-4">
                <h1 className="text-2xl font-semibold mb-6">Colecciones</h1>

                <button
                    onClick={() => router.visit(route('colecciones.create'))}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Crear Colección
                </button>

                {colecciones.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {colecciones.map((coleccion) => (
                            <div
                                key={coleccion.id}
                                onClick={(e) => handleClick(e, coleccion.id)}
                                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                                    {coleccion.nombre}
                                </h2>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                    {coleccion.descripcion}
                                </p>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                    Estado: {coleccion.abierta ? 'Abierta' : 'Cerrada'}
                                </p>
                                <a
                                    href={`/colecciones/${coleccion.id}`}
                                    className="text-blue-600 hover:underline mt-4 block"
                                >
                                    Ver detalles
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No hay colecciones disponibles.</p>
                )}
            </div>
        </>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;
