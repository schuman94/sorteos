import { router } from '@inertiajs/react';
import { formatearFecha as ff } from '@/utils/fecha';

export default function SorteoCard({ sorteo }) {
    const handleClick = (e) => {
        // Si el click proviene de un <a>, no navegamos con router
        if (e.target.closest('a')) return;

        router.visit(route('sorteo.show', sorteo.id));
    };

    return (
        <div
            onClick={handleClick}
            className="rounded-xl shadow-lg overflow-hidden cursor-pointer transition hover:shadow-xl bg-white dark:bg-gray-800"
        >
            {/* Cabecera turquesa con icono y título */}
            <div className="bg-[#1cc2b5] px-5 py-2 flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-medium text-white break-words line-clamp-2">
                    <a
                        href={sorteo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        onClick={(e) => e.stopPropagation()} // Evita que el click en el link dispare el router
                    >
                        {(sorteo.titulo?.length > 100 ? sorteo.titulo.slice(0, 100) + '...' : sorteo.titulo || 'Sin título')}
                    </a>
                </h2>
            </div>

            {/* Cuerpo de detalles */}
            <div className="p-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p><strong>Participantes:</strong> {sorteo.num_participantes}</p>
                <p><strong>Fecha:</strong> {ff(sorteo.created_at)}</p>
                <p><strong>Tipo:</strong> {sorteo.tipo}</p>
            </div>
        </div>
    );
}
