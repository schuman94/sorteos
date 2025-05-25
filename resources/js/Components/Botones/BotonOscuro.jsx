export default function BotonOscuro({ children, onClick, className = '', ...props }) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md
                bg-[#2e2b4a] text-white font-semibold hover:bg-[#403d61]
                shadow-sm active:scale-95 transition-transform duration-100 ease-in-out
                disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
