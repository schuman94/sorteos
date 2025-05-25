import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Paginacion from '@/Components/Paginacion';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import BotonAzul from '@/Components/Botones/BotonAzul';

export default function Index({ colecciones, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    // Debounce: espera 400ms tras dejar de escribir antes de enviar la petición
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(route('colecciones.index'), { search }, {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            });
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    return (
        <>
            <Head title="Colecciones" />

            <div className="max-w-5xl mx-auto py-12 px-4 space-y-10">
                <h1 className="text-2xl font-semibold">Rascas</h1>
                <div>
                    <div className="flex flex-wrap gap-4 mb-6">
                        <BotonPrimario onClick={() => router.visit(route('colecciones.create'))}>
                            Crear Colección
                        </BotonPrimario>

                        <BotonAzul onClick={() => router.visit(route('premios.index'))}>
                            Gestionar premios
                        </BotonAzul>
                    </div>
                </div>

                {/* Buscador */}
                <div className="mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre..."
                        className="w-full max-w-md px-4 py-2 border-[1.5px] border-[#1cc2b5] rounded-md bg-white text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                    />
                </div>


                {colecciones.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {colecciones.data.map((coleccion) => (
                                <div
                                    key={coleccion.id}
                                    onClick={() => router.visit(route('colecciones.show', coleccion.id))}
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
                                </div>
                            ))}
                        </div>

                        <Paginacion
                            links={colecciones.links}
                            onPageChange={(url) => {
                                if (!url) return;
                                router.visit(url, {
                                    preserveScroll: true,
                                    preserveState: true,
                                    data: { search },
                                });
                            }}
                        />
                    </>
                ) : (
                    <p className="text-center text-gray-500 mt-8">No hay colecciones disponibles.</p>
                )}
            </div>
        </>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;
