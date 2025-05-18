import MainLayout from '@/Layouts/MainLayout';
import TablaListado from '@/Components/TablaListado';
import { Head, Link } from '@inertiajs/react';
import { formatearFechaCorta as ffc } from '@/utils/fecha';
import { formatearDinero as dinero} from '@/utils/dinero';

export default function Index({ premios, filters, anyos }) {
    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'nombre',
            cell: info => {
                const row = info.row.original;
                return (
                    <Link
                        href={route('premios.show', row.id)}
                        preserveScroll
                        className="text-blue-600 underline"
                    >
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
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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
