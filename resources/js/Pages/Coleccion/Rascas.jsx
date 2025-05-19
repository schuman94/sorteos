import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import TablaListado from '@/Components/TablaListado';
import { formatearFecha as ff } from '@/utils/fecha';

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
            cell: info => info.getValue() ? ff(info.getValue()) : '',
        },
        {
            header: 'Rascado en',
            accessorKey: 'scratched_at',
            cell: info => info.getValue() ? ff(info.getValue()) : '',
        },
        {
            header: 'Rascado por',
            accessorKey: 'scratched_by',
            cell: info => info.getValue() || '',
        },
        {
            header: 'Premio',
            accessorKey: 'premio',
            cell: info => {
                const row = info.row.original;
                return row.premio
                    ? (
                        <Link
                            href={route('premios.show', row.premio_id)}
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {row.premio}
                        </Link>
                    )
                    : '';
            }
        }

    ];


    return (
        <>
            <Head title={`Rascas proporcionados - ${coleccion.nombre}`} />

            <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Rascas proporcionados - {coleccion.nombre}</h1>
                    <Link
                        href={route('colecciones.show', coleccion.id)}
                        className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded"
                    >
                        Volver a la colección
                    </Link>
                </div>

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
