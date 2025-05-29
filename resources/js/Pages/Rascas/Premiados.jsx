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
                return (
                    <div className="flex items-center gap-3">
                        {row.thumbnail_url && (
                            <a
                                href={row.premio_link || '#'}
                                target={row.premio_link ? '_blank' : undefined}
                                rel={row.premio_link ? 'noopener noreferrer' : undefined}
                                className="group"
                            >
                                <img
                                    src={row.thumbnail_url}
                                    alt={`Miniatura de ${row.premio}`}
                                    className="w-10 h-10 object-cover rounded-md transition-transform group-hover:scale-105"
                                />
                            </a>
                        )}
                        {row.premio_link ? (
                            <a
                                href={row.premio_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                {row.premio}
                            </a>
                        ) : (
                            <span>{row.premio || ''}</span>
                        )}
                    </div>
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
