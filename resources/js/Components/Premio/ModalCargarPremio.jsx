import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

export default function ModalCargarPremio({ visible, onClose, onSeleccionarPremio }) {
    const [premios, setPremios] = useState([]);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        if (visible) {
            cargarPremios();
        }
    }, [visible]);

    const cargarPremios = async () => {
        try {
            const response = await axios.get(route('premios.index'));
            setPremios(response.data);
            setCargando(false);
        } catch (error) {
            console.error(error);
            setError('Error al cargar los premios.');
            setCargando(false);
        }
    };

    const premiosFiltrados = premios.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()));

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Seleccionar Premio</h2>
                <input
                    type="text"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Buscar por nombre..."
                    className="w-full border rounded px-3 py-2 mb-4"
                />

                {cargando && <p className="text-gray-600">Cargando premios...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!cargando && !error && (
                    <div className="space-y-4">
                        {premiosFiltrados.length > 0 ? (
                            premiosFiltrados.map((premio) => (
                                <div key={premio.id} className="flex justify-between items-center bg-gray-100 p-4 rounded shadow-sm">
                                    <span>{premio.nombre}</span>
                                    <button
                                        onClick={() => {
                                            onSeleccionarPremio(premio);
                                            onClose();
                                        }}
                                        className="bg-blue-500 text-white rounded px-4 py-1"
                                    >
                                        Seleccionar
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron premios.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
