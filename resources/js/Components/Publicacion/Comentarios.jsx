import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Comentario from '@/Components/Publicacion/Comentario';

export default function Comentarios() {
    const [comentarios, setComentarios] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarComentarios(1);
    }, []);

    const cargarComentarios = (paginaActual) => {
        setLoading(true);
        axios.get(route('comentarios.visualizar'), {
            params: { page: paginaActual }
        })
            .then(response => {
                const nuevosComentarios = response.data.data;
                setComentarios(prev => [...prev, ...nuevosComentarios]);

                // Si estamos en la última página, no hay más comentarios
                if (paginaActual >= response.data.last_page) {
                    setHasMore(false);
                }
            })
            .catch(() => {
                setError('No se pudieron cargar los comentarios');
            })
            .finally(() => setLoading(false));
    };

    const mostrarMas = () => {
        const siguientePagina = pagina + 1;
        setPagina(siguientePagina);
        cargarComentarios(siguientePagina);
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4">Lista de comentarios</h2>

            {loading && comentarios.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Cargando comentarios...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : comentarios.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No se han encontrado comentarios.</p>
            ) : (
                <>
                    <ul className="space-y-4">
                        {comentarios.map((comentario, index) => (
                            <Comentario key={index} {...comentario} />
                        ))}
                    </ul>

                    {hasMore && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={mostrarMas}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                disabled={loading}
                            >
                                {loading ? 'Cargando...' : 'Cargar más'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
