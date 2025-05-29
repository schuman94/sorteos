import MainLayout from '@/Layouts/MainLayout';
import TablaListado from '@/Components/TablaListado';
import { Head, Link } from '@inertiajs/react';
import { formatearFechaCorta as ffc } from '@/utils/fecha';
import { formatearDinero as dinero } from '@/utils/dinero';

export default function Index({ premios, filters, anyos }) {
    const columns = [
        {
            header: 'Premio', // Antes: 'Nombre'
            accessorKey: 'nombre',
            cell: info => {
                const row = info.row.original;
                return (
                    <Link
                        href={route('premios.show', row.id)}
                        preserveScroll
                        className="flex items-center gap-3 text-blue-600 underline hover:text-blue-800"
                    >
                        {row.thumbnail_url && (
                            <img
                                src={row.thumbnail_url}
                                alt={`Miniatura de ${row.nombre}`}
                                className="w-10 h-10 object-cover rounded-md"
                            />
                        )}
                        {row.nombre}
                    </Link>
                );
            }
        },
        {
            header: 'Proveedor',
            accessorKey: 'proveedor',
        },
        {
            header: 'Valor',
            accessorKey: 'valor',
            cell: info => dinero(info.getValue()),
        },
        {
            header: 'Fecha',
            accessorKey: 'created_at',
            cell: info => ffc(info.getValue()),
        },
    ];

    return (
        <>
            <Head title="Premios" />

            <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Premios</h1>
                    <Link
                        href={route('premios.create')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-[#1cc2b5] text-white font-semibold hover:bg-[#17b0a6] shadow-sm active:scale-95 transition-transform duration-100 ease-in-out"
                    >
                        Nuevo premio
                    </Link>
                </div>

                <TablaListado
                    data={premios}
                    columns={columns}
                    filters={filters}
                    rutaIndex="premios.index"
                    placeholder="Buscar por nombre o proveedor..."
                    anyos={anyos}
                />
            </div>
        </>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;
