import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import TablaListado from '@/Components/TablaListado';
import { formatearFechaCorta as ffc } from '@/utils/fecha';

export default function Index({ users, filters }) {
    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'name',
            cell: info => {
                const row = info.row.original;
                return (
                    <Link
                        href={route('admin.users.show', row.id)}
                        preserveScroll
                        className="text-blue-600 underline flex items-center gap-2"
                    >
                        {row.name}
                    </Link>
                );
            }
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
            header: 'Rol',
            accessorKey: 'isAdmin',
            cell: info => info.getValue() ? 'Admin' : 'Usuario',
        },
        {
            header: 'Registro',
            accessorKey: 'created_at',
            cell: info => ffc(info.getValue()),
        },
    ];


    return (
        <>
            <Head title="Usuarios" />
            <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
                <h1 className="text-2xl font-bold">Usuarios registrados</h1>

                <TablaListado
                    data={users}
                    columns={columns}
                    filters={filters}
                    rutaIndex="admin.users.index"
                    placeholder="Buscar por nombre o email..."
                />

            </div>
        </>
    );
}

Index.layout = page => <MainLayout>{page}</MainLayout>;
