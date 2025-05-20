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
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
        >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                <a
                    href={sorteo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Evita que el click en el link dispare el router
                >
                    {(sorteo.titulo?.length > 100 ? sorteo.titulo.slice(0, 100) + '...' : sorteo.titulo || 'Sin título')}

                </a>
            </h2>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Participantes:</strong> {sorteo.num_participantes}</p>
                <p><strong>Fecha:</strong> {ff(sorteo.created_at)}</p>
                <p><strong>Tipo:</strong> {sorteo.tipo}</p>
            </div>
        </div>
    );
}
