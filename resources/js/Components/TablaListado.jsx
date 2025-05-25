import { router } from '@inertiajs/react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, MoveVertical } from 'lucide-react';
import Paginacion from '@/Components/Paginacion';

export default function TablaListado({ data, columns, filters, rutaIndex, placeholder = 'Buscar...', anyos = [] }) {
    const getRuta = () => {
        return Array.isArray(rutaIndex) ? route(...rutaIndex) : route(rutaIndex);
    };

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

            router.get(getRuta(), {
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
                        router.get(getRuta(), {
                            ...filters,
                            search: e.target.value,
                        }, { preserveState: true })
                    }
                    className="w-full sm:w-[300px] px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                    placeholder={placeholder}
                />

                {anyos.length > 0 && (
                    <select
                        value={filters.anyo || ''}
                        onChange={(e) =>
                            router.get(getRuta(), {
                                ...filters,
                                anyo: e.target.value || undefined,
                            }, { preserveState: true })
                        }
                        className="w-full sm:w-[90px] px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                    >
                        <option value="">Año</option>
                        {anyos.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                )}
            </div>

            <table className="min-w-full text-sm bg-white shadow rounded overflow-hidden">
                <thead className="bg-[#1cc2b5] text-left text-white">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                const sorted = header.column.getIsSorted();

                                return (
                                    <th
                                        key={header.id}
                                        className="px-4 py-2 cursor-pointer select-none text-white"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="inline-flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {sorted === 'asc' && <ArrowUp className="w-4 h-4 text-white" />}
                                            {sorted === 'desc' && <ArrowDown className="w-4 h-4 text-white" />}
                                            {!sorted && <MoveVertical className="w-4 h-4 text-white" />}
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

            <div className="mt-6">
                <Paginacion links={data.links} onPageChange={(url) =>
                    router.get(url, {}, { preserveState: true })
                } />
            </div>
        </>
    );
}
