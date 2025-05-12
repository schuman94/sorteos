import { useEffect, useState } from 'react';

export default function CuentaRegresiva({ segundos, onComplete }) {
    const [contador, setContador] = useState(segundos);
    const [animando, setAnimando] = useState(false);

    useEffect(() => {
        if (contador <= 0) {
            onComplete();
            return;
        }

        setAnimando(true);
        const intervalo = setInterval(() => {
            setContador((prev) => prev - 1);
            setAnimando(true);
        }, 1000);

        return () => clearInterval(intervalo);
    }, [contador, onComplete]);

    // Resetear animación cada vez que cambia el número
    useEffect(() => {
        if (animando) {
            const timeout = setTimeout(() => setAnimando(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [animando]);

    return (
        <div className="flex items-center justify-center h-64">
            <div
                className={`
                    text-[180px]
                    font-extrabold
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500
                    drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]
                    transition-transform duration-300 ease-in-out
                    ${animando ? 'scale-125' : 'scale-100'}
                `}
            >
                {contador}
            </div>
        </div>
    );
}
