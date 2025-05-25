export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-[#1cc2b5] shadow-sm focus:ring-[#1cc2b5] ' +
                className
            }
        />
    );
}
