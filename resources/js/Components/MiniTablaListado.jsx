import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, MoveVertical } from 'lucide-react';

export default function MiniTablaListado({ columns, rutaIndex, anyos = [], placeholder = 'Buscar...', onSeleccionar = null, onClose = null, }) {
    const [data, setData] = useState({ data: [], current_page: 1, last_page: 1 });
    const [filters, setFilters] = useState({
        search: '',
        sort: 'created_at',
        direction: 'desc',
        anyo: '',
        page: 1,
    });

    const fetchData = async () => {
        try {
            const response = await axios.get(route(rutaIndex), { params: filters });
            setData(response.data.premios);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const sorting = useMemo(() => {
        if (!filters.sort) return [];
        return [{
            id: filters.sort,
            desc: filters.direction === 'desc',
        }];
    }, [filters.sort, filters.direction]);


    const table = useReactTable({
        data: data.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),

        state: { sorting },
        onSortingChange: (updater) => {
            const sortState = typeof updater === 'function' ? updater(sorting) : updater;
            const newSort = sortState[0]?.id;
            const newDirection = sortState[0]?.desc ? 'desc' : 'asc';

            setFilters(prev => {
                if (prev.sort === newSort && prev.direction === newDirection) return prev;
                return {
                    ...prev,
                    sort: newSort,
                    direction: newDirection,
                    page: 1,
                };
            });
        },
    });

    return (
        <>
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                        setFilters(prev => ({
                            ...prev,
                            search: e.target.value,
                            page: 1,
                        }))
                    }
                    className="border rounded px-3 py-2 w-full sm:w-[300px]"
                    placeholder={placeholder}
                />

                {anyos.length > 0 && (
                    <select
                        value={filters.anyo}
                        onChange={(e) =>
                            setFilters(prev => ({
                                ...prev,
                                anyo: e.target.value,
                                page: 1,
                            }))
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
                        <tr
                            key={row.id}
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                if (typeof onSeleccionar === 'function') {
                                    onSeleccionar(row.original);
                                }
                                if (typeof onClose === 'function') {
                                    onClose();
                                }
                            }}
                        >
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
                            setFilters(prev => ({
                                ...prev,
                                page: data.current_page - 1,
                            }))
                        }
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <button
                        disabled={data.current_page >= data.last_page}
                        onClick={() =>
                            setFilters(prev => ({
                                ...prev,
                                page: data.current_page + 1,
                            }))
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
