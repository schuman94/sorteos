export default function BotonPrimario({ children, onClick, className = '', ...props }) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-[#1cc2b5] text-white font-semibold hover:bg-[#17b0a6] shadow-sm disabled:opacity-50 active:scale-95 transition-transform duration-100 ease-in-out ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
