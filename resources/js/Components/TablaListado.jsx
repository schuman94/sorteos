import { router } from '@inertiajs/react';
import { useReactTable, getCoreRowModel,  flexRender } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, MoveVertical } from 'lucide-react';

export default function TablaListado({ data, columns, filters, rutaIndex, placeholder = 'Buscar...', anyos = [] }) {
    const table = useReactTable({
        data: data.data,
        columns,
        getCoreRowModel: getCoreRowModel(),

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

            router.get(route(rutaIndex), {
                ...filters,
                sort,
                direction,
            }, { preserveState: true });
        },
    });

    return (
        <>
            <div className="mb-4 flex flex-wrap items-center gap-4">

                <input
                    type="text"
                    defaultValue={filters.search || ''}
                    onChange={(e) =>
                        router.get(route(rutaIndex), {
                            ...filters,
                            search: e.target.value,
                        }, { preserveState: true })
                    }
                    className="border rounded px-3 py-2 w-full sm:w-[300px]"
                    placeholder={placeholder}
                />


                {anyos.length > 0 && (
                    <select
                        value={filters.anyo || ''}
                        onChange={(e) =>
                            router.get(route(rutaIndex), {
                                ...filters,
                                anyo: e.target.value || undefined,
                            }, { preserveState: true })
                        }
                        className="border rounded px-3 py-2 w-full sm:w-[90px]"
                    >
                        <option value="">Año</option>
                        {anyos.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                )}
            </div>


            <table className="min-w-full text-sm bg-white shadow rounded overflow-hidden">
                <thead className="bg-gray-100 text-left">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                const sorted = header.column.getIsSorted();

                                return (
                                    <th
                                        key={header.id}
                                        className="px-4 py-2 cursor-pointer select-none"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="inline-flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {sorted === 'asc' && <ArrowUp className="w-4 h-4" />}
                                            {sorted === 'desc' && <ArrowDown className="w-4 h-4" />}
                                            {!sorted && <MoveVertical className="w-4 h-4 text-gray-400" />}
                                        </div>
                                    </th>
                                );
                            })}
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
                    {data.current_page} de {data.last_page}
                </span>

                <div className="space-x-2">
                    {data.prev_page_url && (
                        <button
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={() => router.get(data.prev_page_url, {}, { preserveState: true })}
                        >
                            Anterior
                        </button>
                    )}
                    {data.next_page_url && (
                        <button
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={() => router.get(data.next_page_url, {}, { preserveState: true })}
                        >
                            Siguiente
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
