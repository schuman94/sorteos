import React, { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export default function ModalCargarRuleta({ visible, onClose, onSeleccionar }) {
    const [ruletas, setRuletas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [porPagina] = useState(6);

    const cargarRuletas = () => {
        setCargando(true);
        axios.get(route('ruletas.index'))
            .then(response => {
                setRuletas(response.data);
                setCargando(false);
                setError(null);
            })
            .catch(error => {
                console.error('Error al cargar ruletas:', error);
                setError('No se pudieron cargar tus ruletas.');
                setCargando(false);
            });
    };

    useEffect(() => {
        if (visible) {
            cargarRuletas();
        }
    }, [visible]);

    const eliminarRuleta = (id) => {
        if (!confirm('¿Seguro que quieres eliminar esta ruleta?')) return;
        axios.delete(route('ruletas.destroy', id))
            .then(() => {
                setRuletas(prev => prev.filter(r => r.id !== id));
            })
            .catch(() => alert('Error al eliminar la ruleta.'));
    };

    const ruletasFiltradas = ruletas.filter(r =>
        r.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    const totalPaginas = Math.ceil(ruletasFiltradas.length / porPagina);
    const ruletasPaginadas = ruletasFiltradas.slice((paginaActual - 1) * porPagina, paginaActual * porPagina);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Mis ruletas</h2>

                <input
                    type="text"
                    value={filtro}
                    onChange={e => {
                        setFiltro(e.target.value);
                        setPaginaActual(1);
                    }}
                    placeholder="Buscar por nombre..."
                    className="w-full border rounded px-3 py-2 mb-4"
                />

                {cargando && <p className="text-gray-600">Cargando ruletas...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!cargando && !error && (
                    <>
                        {ruletasPaginadas.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {ruletasPaginadas.map(ruleta => (
                                    <div key={ruleta.id} className="bg-gray-100 p-4 rounded shadow-sm">
                                        <h3 className="font-semibold">{ruleta.nombre}</h3>
                                        <p className="text-xs text-gray-500">
                                            {new Date(ruleta.created_at).toLocaleString()}
                                        </p>
                                        <div className="mt-2 flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    onSeleccionar(ruleta);
                                                    onClose();
                                                }}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Cargar
                                            </button>
                                            <button
                                                onClick={() => eliminarRuleta(ruleta.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No se encontraron ruletas.</p>
                        )}

                        {totalPaginas > 1 && (
                            <div className="flex justify-center gap-4 mb-4">
                                <button
                                    onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
                                    disabled={paginaActual === 1}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                                >
                                    Anterior
                                </button>
                                <span className="self-center">Página {paginaActual} de {totalPaginas}</span>
                                <button
                                    onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
                                    disabled={paginaActual === totalPaginas}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
