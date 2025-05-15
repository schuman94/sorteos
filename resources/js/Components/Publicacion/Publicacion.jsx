import { formatearFechaCorta as ffc } from '@/utils/fecha';
import { ThumbsUp, MessageCircle, Eye } from 'lucide-react';


export default function Publicacion({ autor, num_comentarios, likes, fecha_publicacion, titulo, visualizaciones }) {
    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded bg-white shadow dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl font-semibold mb-4">Publicación</h2>

            {titulo && <p className="mb-2">{titulo}</p>}
            <p className="mb-2"><strong>Autor:</strong> {autor}</p>
            <p className="mb-2"><strong>Fecha:</strong> {ffc(fecha_publicacion)}</p>
            <div className="flex items-center gap-4 mb-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    {num_comentarios}
                </div>
                <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-blue-500" />
                    {likes}
                </div>
                {visualizaciones !== null && (
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-blue-500" />
                        {visualizaciones}
                    </div>
                )}
            </div>

        </div>
    );
}
