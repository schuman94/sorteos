import ModalEliminacion from '@/Components/ModalEliminacion';
import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import { formatearFecha as ff } from '@/utils/fecha';

export default function ModalCargarRuleta({ visible, onClose, onSeleccionar, ruletaCargadaId, onEliminarActual }) {
    const [ruletas, setRuletas] = useState([]); // Todas las ruletas del usuario
    const [filtro, setFiltro] = useState(''); // Filtro de nombre para las ruletas
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null); // Error en la carga de las ruletas
    const [mostrarCantidad, setMostrarCantidad] = useState(6); // Numero de ruletas mostradas en el modal

    // Cuando la propiedad visible cambia, se elimina el filtro y se reinicia la carga de ruletas
    useEffect(() => {
        if (visible) {
            setFiltro('');
            cargarRuletas();
        }
    }, [visible]);

    const cargarRuletas = async () => {
        setCargando(true);
        try {
            const response = await axios.get(route('ruletas.index'));
            setRuletas(response.data); // response.data contiene el json con todas las ruletas devuelto por el metodo index
            setError(null);
            setMostrarCantidad(6); // Reinicia el numero de ruletas mostradas a 6
        } catch (error) {
            console.error('Error al cargar ruletas:', error);
            setError('No se pudieron cargar tus ruletas.');
        } finally {
            setCargando(false);
        }
    };

    // Ruletas filtradas por nombre
    const ruletasFiltradas = ruletas.filter(r =>
        r.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    // Ruleta mostradas en el modal
    const ruletasMostradas = ruletasFiltradas.slice(0, mostrarCantidad);

    const [confirmarVisible, setConfirmarVisible] = useState(false);
    const [ruletaPendienteEliminar, setRuletaPendienteEliminar] = useState(null);

    // Mostrar modal para confirmar la eliminación de la ruleta seleccionada
    const confirmarEliminar = (ruleta) => {
        setRuletaPendienteEliminar(ruleta);
        setConfirmarVisible(true);
    };

    const eliminarRuleta = async () => {
        if (!ruletaPendienteEliminar) return; // Por seguridad: Si no hay ruleta pendiente de eliminar, no se hace nada
        try {
            const response = await axios.delete(route('ruletas.destroy', ruletaPendienteEliminar.id));
            // Eliminamos desde el cliente la ruleta de la lista para evitar hacer una nueva carga desde el backend
            // Esto lo hacemos cargando con set una copia de la variable ruletas a la que le hemos eliminado la ruletaPendienteEliminar
            setRuletas(prev => {
                const nuevasRuletas = prev.filter(r => r.id !== ruletaPendienteEliminar.id);
                if (ruletaPendienteEliminar.id === ruletaCargadaId) { // Si la ruleta que hemos eliminado era la que estaba cargada...
                    onEliminarActual(); // Se ejecuta onEliminarActual (definida en ruleta.jsx) para borrar la carga.
                }
                return nuevasRuletas;
            });
        } catch (error) {
            console.error('Error al eliminar la ruleta:', error);
        } finally {
            setConfirmarVisible(false); // Cerramos modal de confirmar eliminar
            setRuletaPendienteEliminar(null); // Ya no hay ruleta pendiente de eliminar
        }
    }

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg max-h-[90vh] overflow-y-auto min-h-[500px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mis ruletas</h2>
                    <button
                        onClick={onClose}
                        className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                    >
                        Cancelar
                    </button>
                </div>

                <input
                    type="text"
                    value={filtro}
                    onChange={e => {
                        setFiltro(e.target.value);
                        setMostrarCantidad(6);
                    }}
                    placeholder="Buscar por nombre..."
                    className="w-full border rounded px-3 py-2 mb-4"
                />

                {cargando && <p className="text-gray-600">Cargando ruletas...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!cargando && !error && (
                    <>
                        {ruletasMostradas.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {ruletasMostradas.map(ruleta => (
                                    <div key={ruleta.id} className="bg-gray-100 p-4 rounded shadow-sm">
                                        <h3 className="font-semibold truncate max-w-full">
                                            {ruleta.nombre.length > 30 ? ruleta.nombre.slice(0, 30) + '...' : ruleta.nombre}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {ff(ruleta.created_at)}
                                        </p>
                                        <div className="mt-2 flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    onSeleccionar(ruleta); // cargarRuleta en ruleta.jsx
                                                    onClose(); // setMostrarModalCargar(false) en ruleta.jsx
                                                }}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Cargar
                                            </button>
                                            <button
                                                onClick={() => confirmarEliminar(ruleta)}
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

                        {ruletasMostradas.length < ruletasFiltradas.length && (
                            <div className="flex justify-center mb-4">
                                <button
                                    onClick={() => setMostrarCantidad(c => c + 6)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Mostrar más
                                </button>
                            </div>
                        )}
                    </>
                )}

                <ModalEliminacion
                    visible={confirmarVisible}
                    titulo="¿Eliminar ruleta?"
                    mensaje={`¿Seguro que deseas eliminar "${ruletaPendienteEliminar?.nombre}"?`}
                    onCancelar={() => setConfirmarVisible(false)}
                    onConfirmar={eliminarRuleta}
                />
            </div>
        </div>
    );
}
