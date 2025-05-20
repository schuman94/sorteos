import { router } from '@inertiajs/react';

export default function Paginacion({ links }) {
    const traducirLabel = (label) => {
        if (label === '&laquo; Previous') return 'Anterior';
        if (label === 'Next &raquo;') return 'Siguiente';
        return label;
    };

    return (
        <nav className="mt-8 flex justify-center items-center gap-2 flex-wrap text-sm">
            {links.map((link, i) => (
                <button
                    key={i}
                    onClick={() => link.url && router.visit(link.url)}
                    dangerouslySetInnerHTML={{ __html: traducirLabel(link.label) }}
                    disabled={!link.url}
                    className={`
                        min-w-[40px]
                        px-4 py-2 rounded border transition
                        ${link.active
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}
                        ${!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                />
            ))}
        </nav>
    );
}
