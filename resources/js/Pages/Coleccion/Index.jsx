import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import TablaListado from '@/Components/TablaListado';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import BotonAzul from '@/Components/Botones/BotonAzul';
import { formatearFechaCorta as ffc } from '@/utils/fecha';
import { formatearDinero as dinero } from '@/utils/dinero';

export default function Index({ colecciones, filters, anyos }) {
    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'nombre',
            cell: info => {
                const row = info.row.original;
                return (
                    <Link
                        href={route('colecciones.show', row.id)}
                        preserveScroll
                        className="text-blue-600 underline"
                    >
                        {row.nombre}
                    </Link>
                );
            }
        },
        {
            header: 'Fecha',
            accessorKey: 'created_at',
            cell: info => ffc(info.getValue()),
        },
        {
            header: 'Estado',
            accessorKey: 'abierta',
            cell: info => info.getValue() ? 'Abierta' : 'Cerrada',
        },
        {
            header: 'Rascas',
            accessorKey: 'rascas_count',
        },
        {
            header: 'Proporcionados',
            accessorKey: 'total_proporcionados',
        },
        {
            header: 'Rascados',
            accessorKey: 'total_rascados',
        },
        {
            header: 'Premios',
            accessorKey: 'premios_totales',
        },
        {
            header: 'Obtenidos',
            accessorKey: 'premios_obtenidos',
        },
        {
            header: 'Valor',
            accessorKey: 'valor_total',
            cell: info => {
                const valor = info.getValue();
                return valor ? dinero(valor) : '—';
            },
        },
    ];

    return (
        <>
            <Head title="Colecciones" />

            <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Colecciones</h1>

                    <div className="flex flex-wrap gap-4">
                        <BotonPrimario onClick={() => route().visit(route('colecciones.create'))}>
                            Crear Colección
                        </BotonPrimario>

                        <BotonAzul onClick={() => route().visit(route('premios.index'))}>
                            Gestionar premios
                        </BotonAzul>
                    </div>
                </div>

                <TablaListado
                    data={colecciones}
                    columns={columns}
                    filters={filters}
                    rutaIndex="colecciones.index"
                    placeholder="Buscar por nombre..."
                    anyos={anyos}
                />
            </div>
        </>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;
