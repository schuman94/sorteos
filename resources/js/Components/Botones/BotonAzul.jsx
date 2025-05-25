export default function BotonAzul({ children, onClick, className = '', ...props }) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-[#36A2EB] text-white font-semibold hover:bg-[#2d8bd3] transition-colors duration-200 shadow-sm disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
