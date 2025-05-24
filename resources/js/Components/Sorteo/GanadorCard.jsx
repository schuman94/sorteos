import { formatearFecha as ff } from '@/utils/fecha';
import { ThumbsUp } from 'lucide-react';

export default function GanadorCard({ nombre, posicion, comentario, likes, fecha, urlHost }) {
    const construirPerfil = () => {
        if (!comentario || !urlHost) return null;

        const username = nombre.startsWith('@') ? nombre.slice(1) : nombre;
        const base = urlHost.endsWith('/') ? urlHost.slice(0, -1) : urlHost;

        if (base.includes('youtube')) {
            return `${base}/@${username}`;
        }

        if (base.includes('bsky')) {
            return `${base}/profile/${username}`;
        }

        return null;
    };

    const perfilUrl = construirPerfil();

    return (
        <div className="relative border border-[#1cc2b5] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-md overflow-hidden">
            {/* Posición en esquina superior derecha */}
            <div className="absolute top-0 right-0 bg-[#1cc2b5] text-white text-xs font-bold px-2 py-1">
                #{posicion}
            </div>

            {/* Contenido */}
            <div className="p-5 space-y-3">
                {/* Nombre */}
                <div className="text-lg font-semibold">
                    {perfilUrl ? (
                        <a
                            href={perfilUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1cc2b5] hover:underline"
                        >
                            {nombre}
                        </a>
                    ) : (
                        nombre
                    )}
                </div>

                {/* Comentario */}
                {comentario && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 italic">
                        {comentario}
                    </div>
                )}

                {/* Detalles (solo si hay likes o fecha) */}
                {(likes != null || fecha) && (
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                        {likes != null && (
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4 text-[#1cc2b5]" />
                                {likes}
                            </div>
                        )}
                        {fecha && <span>{ff(fecha)}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
