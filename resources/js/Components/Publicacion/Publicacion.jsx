import { formatearFechaCorta as ffc } from '@/utils/fecha';
import { ThumbsUp, MessageCircle, Eye, User, Calendar, FileVideo } from 'lucide-react';

export default function Publicacion({ autor, num_comentarios, likes, fecha_publicacion, titulo, visualizaciones }) {
    return (
        <div className="max-w-md mx-auto mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-[#1cc2b5]">
            {/* Encabezado */}
            <div className="bg-[#1cc2b5] px-6 py-4 flex items-center gap-3">
                <FileVideo className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">Publicación</h2>
            </div>

            {/* Cuerpo */}
            <div className="p-5 text-gray-800 dark:text-gray-200 space-y-3 text-sm">
                {titulo && (
                    <p className="text-base font-medium text-gray-900 dark:text-white">{titulo}</p>
                )}

                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 text-[#1cc2b5]" />
                    <span><strong>Autor:</strong> {autor}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-[#1cc2b5]" />
                    <span><strong>Fecha:</strong> {ffc(fecha_publicacion)}</span>
                </div>

                <div className="flex items-center gap-5 text-gray-700 dark:text-gray-300 pt-1">
                    <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-[#1cc2b5]" />
                        {num_comentarios}
                    </div>
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4 text-[#1cc2b5]" />
                        {likes}
                    </div>
                    {visualizaciones !== null && (
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-[#1cc2b5]" />
                            {visualizaciones}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
