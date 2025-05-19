import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import TablaListado from '@/Components/TablaListado';
import { formatearFechaCorta as ffc } from '@/utils/fecha';

export default function Premiados({ premiados, filters, anyos }) {
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
            header: 'Colección',
            accessorKey: 'coleccion',
        },
        {
            header: 'Premio',
            accessorKey: 'premio',
            cell: info => {
                const row = info.row.original;
                return row.premio_link ? (
                    <a
                        href={row.premio_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        {row.premio}
                    </a>
                ) : (
                    row.premio || ''
                );
            }
        },
        {
            header: 'Proveedor',
            accessorKey: 'proveedor',
        },
        {
            header: 'Fecha',
            accessorKey: 'scratched_at',
            cell: info => ffc(info.getValue()),
        },
    ];

    return (
        <>
            <Head title="Mis rascas premiados" />
            <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
                <h1 className="text-2xl font-bold">Mis rascas premiados</h1>

                <TablaListado
                    data={premiados}
                    columns={columns}
                    filters={filters}
                    rutaIndex="rascas.premiados"
                    placeholder="Buscar por premio, proveedor o colección..."
                    anyos={anyos}
                />
            </div>
        </>
    );
}

Premiados.layout = page => <MainLayout>{page}</MainLayout>;
