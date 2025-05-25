export default function BotonRojo({ children, onClick, className = '', ...props }) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-200 shadow-sm disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
