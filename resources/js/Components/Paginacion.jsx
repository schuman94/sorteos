export default function Paginacion({ links, onPageChange }) {
    const traducirLabel = (label) => {
        if (label === '&laquo; Previous') return 'Anterior';
        if (label === 'Next &raquo;') return 'Siguiente';
        return label;
    };

    return (
        <nav className="mt-8 flex justify-center items-center gap-2 flex-wrap text-sm">
            {links.map((link, index) => (
                <button
                    key={index}
                    disabled={!link.url}
                    onClick={() => link.url && onPageChange(link.url)}
                    dangerouslySetInnerHTML={{ __html: traducirLabel(link.label) }}
                    className={`px-3 py-1 rounded border text-sm transition font-medium
                        ${link.active
                            ? 'bg-[#1cc2b5] text-white border-[#1cc2b5]'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'}
                        ${link.url
                            ? 'hover:bg-[#17b0a6] hover:text-white hover:border-[#17b0a6]'
                            : 'opacity-50 cursor-not-allowed'}
                    `}
                />
            ))}
        </nav>
    );
}
