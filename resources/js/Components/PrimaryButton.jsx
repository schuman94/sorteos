export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-[#0a081e] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-[#2a2647] focus:bg-[#2a2647] focus:outline-none focus:ring-2 focus:ring-[#1cc2b5] focus:ring-offset-2 ${
                    disabled ? 'opacity-25 cursor-not-allowed' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
