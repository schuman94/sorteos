export default function BotonPrimario({ children, onClick, className = '', ...props }) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-[#1cc2b5] text-white font-semibold hover:bg-[#17b0a6] transition-colors duration-200 shadow-sm ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
