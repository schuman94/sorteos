import SorteoCard from '@/Components/Sorteo/SorteoCard';
import FiltroHistorial from '@/Components/Sorteo/FiltroHistorial';
import Paginacion from '@/Components/Paginacion';
import { Head, router } from '@inertiajs/react';

export default function HistorialSorteos({
    titulo,
    sorteos,
    hosts,
    anyos,
    anyoSeleccionado,
    tipoSeleccionado,
    onFilterRoute,
    userId = null
}) {
    const handleFilterChange = () => {
        const params = {
            anyo: document.getElementById('anyo').value,
            tipo: document.getElementById('tipo').value,
        };

        const routeName = userId
            ? route('admin.users.historial', userId)
            : route(onFilterRoute);

        router.get(routeName, params, { preserveScroll: true });
    };

    const handlePageChange = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title={titulo} />

            <div className="max-w-5xl mx-auto py-12 px-4">
                <FiltroHistorial
                    anyoSeleccionado={anyoSeleccionado}
                    tipoSeleccionado={tipoSeleccionado}
                    anyos={anyos}
                    hosts={hosts}
                    onChange={handleFilterChange}
                />

                {sorteos.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6">
                            {sorteos.data.map((sorteo) => (
                                <SorteoCard key={sorteo.id} sorteo={sorteo} />
                            ))}
                        </div>
                        <Paginacion links={sorteos.links} onPageChange={handlePageChange} />
                    </>
                ) : (
                    <p className="text-center text-gray-500">
                        {userId
                            ? 'No hay sorteos disponibles para este usuario.'
                            : 'No hay sorteos disponibles.'}
                    </p>
                )}
            </div>
        </>
    );
}
