import { useState } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, MoveVertical } from 'lucide-react';

export default function MiniTablaListado({
    data,
    columns,
    filters,
    setFilters,
    anyos = [],
    placeholder = 'Buscar...'
}) {
    const [sorting, setSorting] = useState([{
        id: filters.sort,
        desc: filters.direction === 'desc',
    }]);

    const table = useReactTable({
        data: data.data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
        onSortingChange: (newSorting) => {
            setSorting(newSorting);
            const sort = newSorting[0]?.id;
            const direction = newSorting[0]?.desc ? 'desc' : 'asc';

            setFilters(prev => {
                if (prev.sort === sort && prev.direction === direction) return prev;
                return { ...prev, sort, direction, page: 1 };
            });
        },
    });

    return (
        <>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <input
                    type="text"
                    value={filters.search || ''}
                    onChange={(e) =>
                        setFilters(prev => {
                            if (prev.search === e.target.value) return prev;
                            return { ...prev, search: e.target.value, page: 1 };
                        })
                    }
                    className="border rounded px-3 py-2 w-full sm:w-[300px]"
                    placeholder={placeholder}
                />

                {anyos.length > 0 && (
                    <select
                        value={filters.anyo || ''}
                        onChange={(e) => {
                            const nuevoAnyo = e.target.value || '';
                            setFilters(prev => {
                                if (prev.anyo === nuevoAnyo) return prev;
                                return { ...prev, anyo: nuevoAnyo, page: 1 };
                            });
                        }}
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
                    Página {data.current_page} de {data.last_page}
                </span>

                <div className="space-x-2">
                    <button
                        disabled={data.current_page <= 1}
                        onClick={() =>
                            setFilters(prev => {
                                const nueva = data.current_page - 1;
                                if (nueva === prev.page) return prev;
                                return { ...prev, page: nueva };
                            })
                        }
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <button
                        disabled={data.current_page >= data.last_page}
                        onClick={() =>
                            setFilters(prev => {
                                const nueva = data.current_page + 1;
                                if (nueva === prev.page) return prev;
                                return { ...prev, page: nueva };
                            })
                        }
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </>
    );
}
