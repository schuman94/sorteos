export default function BotonAzul({ children, onClick, className = '', ...props }) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-md bg-[#36A2EB] text-white font-semibold hover:bg-[#2d8bd3] shadow-sm disabled:opacity-50 active:scale-95 transition-transform duration-100 ease-in-out ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
