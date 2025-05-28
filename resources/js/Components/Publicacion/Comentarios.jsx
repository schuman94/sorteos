import Comentario from '@/Components/Publicacion/Comentario';
import axios from '@/lib/axios';
import { useEffect, useState } from 'react';
import Paginacion from '@/Components/Paginacion';
import { MessageCircle } from 'lucide-react';

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
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Cabecera turquesa */}
            <div className="bg-[#1cc2b5] px-6 py-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h2 className="text-xl font-semibold text-white">Lista de comentarios</h2>
            </div>
            {/* Contenido */}
            <div className="p-6">
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
            </div>
        </div>
    );
}
