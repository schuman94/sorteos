import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import TablaListado from '@/Components/TablaListado';
import { formatearFechaCorta as ffc } from '@/utils/fecha';

export default function Rascas({ rascas, filters, coleccion }) {
    const columns = [
        {
            header: 'Rasca',
            accessorKey: 'codigo',
            cell: info => {
                const row = info.row.original;
                const url = route('rascas.show', row.codigo);
                return (
                    <a
                        href={url}
                        className="text-blue-600 underline break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {url}
                    </a>
                );
            }
        },
        {
            header: 'Proporcionado en',
            accessorKey: 'provided_at',
            cell: info => info.getValue() ? ffc(info.getValue()) : '—',
        },
        {
            header: 'Rascado en',
            accessorKey: 'scratched_at',
            cell: info => info.getValue() ? ffc(info.getValue()) : '—',
        },
        {
            header: 'Rascado por',
            accessorKey: 'scratched_by',
            cell: info => info.getValue() || '—',
        },
    ];


    return (
        <>
            <Head title={`Rascas proporcionados - ${coleccion.nombre}`} />

            <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
                <h1 className="text-2xl font-bold">Rascas proporcionados - {coleccion.nombre}</h1>

                <TablaListado
                    data={rascas}
                    columns={columns}
                    filters={filters}
                    rutaIndex={['colecciones.rascasProporcionados', coleccion.id]}
                    placeholder="Buscar por código..."
                />
            </div>
        </>
    );
}

Rascas.layout = page => <MainLayout>{page}</MainLayout>;
