import TablaListado from '@/Components/TablaListado';
import { Link } from '@inertiajs/react';
import { formatearFechaCorta as ffc } from '@/utils/fecha';

export default function Index({ premios, filters }) {
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
        },
        {
            header: 'Fecha',
            accessorKey: 'created_at',
            cell: info => ffc(info.getValue()),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Premios</h1>
            <TablaListado
                data={premios}
                columns={columns}
                filters={filters}
                rutaIndex="premios.index"
                placeholder="Buscar por nombre o proveedor..."
            />
        </div>
    );
}
