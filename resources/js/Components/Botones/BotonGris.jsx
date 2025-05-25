export default function BotonGris({ children, onClick, className = '', ...props }) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors duration-200 shadow-sm ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
