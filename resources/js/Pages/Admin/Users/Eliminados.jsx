import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import TablaListado from '@/Components/TablaListado';
import { formatearFechaCorta as ffc } from '@/utils/fecha';
import { RotateCcw } from 'lucide-react';

export default function Eliminados({ users, filters }) {
    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'name',
            cell: info => <span className="text-gray-700">{info.getValue()}</span>,
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Sorteos',
            accessorKey: 'sorteos_count',
        },
        {
            header: 'Registro',
            accessorKey: 'created_at',
            cell: info => ffc(info.getValue()),
        },
        {
            header: 'Eliminado',
            accessorKey: 'deleted_at',
            cell: info => ffc(info.getValue()),
        },
        {
            header: 'Restaurar',
            id: 'restaurar',
            enableSorting: false,
            cell: info => {
                const row = info.row.original;

                const handleRestaurar = () => {
                    router.post(route('admin.users.restaurar', row.id), {}, {
                    });
                };

                return (
                    <button
                        onClick={handleRestaurar}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-800 rounded-full transition"
                        title="Restaurar usuario"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>

                );
            }
        }
    ];

    return (
        <>
            <Head title="Usuarios eliminados" />
            <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
                <h1 className="text-2xl font-bold">Usuarios eliminados</h1>

                <TablaListado
                    data={users}
                    columns={columns}
                    filters={filters}
                    rutaIndex="admin.users.eliminados"
                    placeholder="Buscar por nombre o email..."
                />
            </div>
        </>
    );
}

Eliminados.layout = page => <MainLayout>{page}</MainLayout>;
