import Comentario from '@/Components/Publicacion/Comentario';
import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import Paginacion from '@/Components/Paginacion';

export default function Comentarios() {
    const [comentarios, setComentarios] = useState([]);
    const [links, setLinks] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarComentarios = async (paginaActual = 1) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(route('comentarios.visualizar'), {
                params: { page: paginaActual }
            });

            setComentarios(response.data.data);
            setLinks(response.data.links);
            setPagina(paginaActual);
        } catch (error) {
            setError('No se pudieron cargar los comentarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarComentarios();
    }, []);

    const handlePageChange = (url) => {
        if (!url) return;
        const urlObj = new URL(url);
        const nuevaPagina = urlObj.searchParams.get("page");
        if (nuevaPagina) {
            cargarComentarios(Number(nuevaPagina));
        }
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

                    <div className="mt-6">
                        <Paginacion links={links} onPageChange={handlePageChange} />
                    </div>
                </>
            )}
        </>
    );
}
