import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel } from '@tanstack/react-table';

export default function Index({ premios, filters }) {
    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'nombre',
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
            header: 'Descripción',
            accessorKey: 'descripcion',
        },
        {
            header: 'Link',
            accessorKey: 'link',
            cell: info => info.getValue() ? (
                <a href={info.getValue()} className="text-blue-600 underline" target="_blank">Ver</a>
            ) : '-',
        },
    ];

    const table = useReactTable({
        data: premios.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting: [{
                id: filters.sort,
                desc: filters.direction === 'desc',
            }]
        },
        onSortingChange: (updater) => {
            const sortState = updater instanceof Function ? updater(table.getState().sorting) : updater;
            const sort = sortState[0]?.id;
            const direction = sortState[0]?.desc ? 'desc' : 'asc';

            router.get(route('premios.index'), {
                ...filters,
                sort,
                direction,
            }, { preserveState: true });
        },
    });

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Premios</h1>

            <div className="mb-4">
                <input
                    type="text"
                    defaultValue={filters.search || ''}
                    onChange={(e) =>
                        router.get(route('premios.index'), {
                            ...filters,
                            search: e.target.value,
                        }, { preserveState: true })
                    }
                    className="border rounded px-3 py-2 w-full max-w-xs"
                    placeholder="Buscar por nombre..."
                />
            </div>

            <table className="min-w-full text-sm bg-white shadow rounded overflow-hidden">
                <thead className="bg-gray-100 text-left">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() === 'asc' && ' 🔼'}
                                    {header.column.getIsSorted() === 'desc' && ' 🔽'}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-4 py-2 border-t">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                    Página {premios.current_page} de {premios.last_page}
                </span>

                <div className="space-x-2">
                    {premios.prev_page_url && (
                        <button
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={() => router.get(premios.prev_page_url, {}, { preserveState: true })}
                        >
                            Anterior
                        </button>
                    )}
                    {premios.next_page_url && (
                        <button
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={() => router.get(premios.next_page_url, {}, { preserveState: true })}
                        >
                            Siguiente
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
