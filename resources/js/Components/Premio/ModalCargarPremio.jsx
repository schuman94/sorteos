import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MiniTablaListado from '@/Components/MiniTablaListado';
import { formatearFechaCorta as ffc } from '@/utils/fecha';
import { formatearDinero as dinero} from '@/utils/dinero';

export default function ModalCargarPremio({ onSeleccionar, onClose }) {
    const [data, setData] = useState({ data: [], current_page: 1, last_page: 1 });
    const [anyos, setAnyos] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        sort: 'created_at',
        direction: 'desc',
        anyo: '',
        page: 1,
    });

    const fetchData = async () => {
        try {
            const response = await axios.get(route('premios.index'), { params: filters });
            setData(response.data.premios);
            setAnyos(response.data.anyos);
        } catch (error) {
            console.error('Error al cargar los premios:', error);
        }
    };

    const prevFilters = useRef();

    useEffect(() => {
        // Evita llamada duplicada si los filtros no han cambiado realmente
        if (JSON.stringify(prevFilters.current) !== JSON.stringify(filters)) {
            prevFilters.current = filters;
            fetchData();
        }
    }, [filters]);

    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'nombre',
        }
        ,
        {
            header: 'Proveedor',
            accessorKey: 'proveedor',
        },
        {
            header: 'Valor',
            accessorFn: row => parseFloat(row.valor), // asegura tipo numérico
            id: 'valor', // obligatorio al usar accessorFn
            cell: info => dinero(info.getValue()),
            sortingFn: 'basic', // sorting numérico básico
        },

        {
            header: 'Fecha',
            accessorKey: 'created_at',
            cell: info => ffc(info.getValue()),
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Seleccionar premio</h2>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                </div>

                <MiniTablaListado
                    rutaIndex="premios.index"
                    columns={columns}
                    anyos={anyos}
                    placeholder="Buscar por nombre o proveedor..."
                    onSeleccionar={onSeleccionar}
                    onClose={onClose}
                />

            </div>
        </div>
    );
}
