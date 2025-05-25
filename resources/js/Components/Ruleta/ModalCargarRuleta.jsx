import ModalEliminacion from '@/Components/ModalEliminacion';
import Paginacion from '@/Components/Paginacion';
import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import { formatearFecha as ff } from '@/utils/fecha';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import BotonGris from '@/Components/Botones/BotonGris';
import BotonRojo from '@/Components/Botones/BotonRojo';

export default function ModalCargarRuleta({ visible, onClose, onSeleccionar, ruletaCargadaId, onEliminarActual }) {
    const [ruletas, setRuletas] = useState([]); // Ruletas actuales de la página
    const [filtro, setFiltro] = useState(''); // Filtro de nombre para las ruletas
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null); // Error en la carga de las ruletas
    const [links, setLinks] = useState([]); // Links de paginación
    const [pagina, setPagina] = useState(1); // Página actual

    const [confirmarVisible, setConfirmarVisible] = useState(false);
    const [ruletaPendienteEliminar, setRuletaPendienteEliminar] = useState(null);

    // Carga inicial y cada vez que cambia página o filtro
    useEffect(() => {
        if (visible) {
            setFiltro('');
            setPagina(1);
        }
    }, [visible]);

    // Se ejecutará cuando `visible` cambie a true o cuando pagina o filtro cambien
    useEffect(() => {
        if (visible) {
            cargarRuletas();
        }
    }, [visible, pagina, filtro]);

    const cargarRuletas = async () => {
        setCargando(true);
        try {
            const response = await axios.get(route('ruletas.index'), {
                params: { page: pagina, search: filtro }
            });

            setRuletas(response.data.data);
            setLinks(response.data.links);
            setError(null);
        } catch (error) {
            console.error('Error al cargar ruletas:', error);
            setError('No se pudieron cargar tus ruletas.');
        } finally {
            setCargando(false);
        }
    };

    // Mostrar modal para confirmar la eliminación de la ruleta seleccionada
    const confirmarEliminar = (ruleta) => {
        setRuletaPendienteEliminar(ruleta);
        setConfirmarVisible(true);
    };

    const eliminarRuleta = async () => {
        if (!ruletaPendienteEliminar) return;
        try {
            await axios.delete(route('ruletas.destroy', ruletaPendienteEliminar.id));
            cargarRuletas(); // Refrescar tras eliminación
            if (ruletaPendienteEliminar.id === ruletaCargadaId) {
                onEliminarActual();
            }
        } catch (error) {
            console.error('Error al eliminar la ruleta:', error);
        } finally {
            setConfirmarVisible(false);
            setRuletaPendienteEliminar(null);
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg max-h-[90vh] overflow-y-auto min-h-[500px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mis ruletas</h2>
                    <BotonGris onClick={onClose} className="text-sm px-4 py-1">
                        Cancelar
                    </BotonGris>
                </div>

                <input
                    type="text"
                    value={filtro}
                    onChange={e => {
                        setFiltro(e.target.value);
                        setPagina(1); // Volver a primera página
                    }}
                    placeholder="Buscar por nombre..."
                    className="w-full px-4 py-2 border-[1.5px] border-[#1cc2b5] rounded-md bg-white text-gray-800 mb-4
               focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:border-[#1cc2b5]"
                />


                {cargando && <p className="text-gray-600">Cargando ruletas...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!cargando && !error && (
                    <>
                        {ruletas.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {ruletas.map(ruleta => (
                                    <div key={ruleta.id} className="bg-gray-100 p-4 rounded shadow-sm">
                                        <h3 className="font-semibold truncate max-w-full">
                                            {ruleta.nombre.length > 30 ? ruleta.nombre.slice(0, 30) + '...' : ruleta.nombre}
                                        </h3>
                                        <p className="text-xs text-gray-500">{ff(ruleta.created_at)}</p>
                                        <div className="mt-2 flex justify-end gap-2">
                                            <BotonPrimario
                                                onClick={() => {
                                                    onSeleccionar(ruleta);
                                                    onClose();
                                                }}
                                                className="px-3 py-1"
                                            >
                                                Cargar
                                            </BotonPrimario>
                                            <BotonRojo
                                                onClick={() => confirmarEliminar(ruleta)}
                                                className="px-3 py-1"
                                            >
                                                Eliminar
                                            </BotonRojo>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No se encontraron ruletas.</p>
                        )}

                        {links.length > 3 && (
                            <Paginacion links={links} onPageChange={(url) => {
                                const nuevaPagina = new URL(url).searchParams.get("page");
                                setPagina(Number(nuevaPagina));
                            }} />
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
