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

    useEffect(() => {
        if (animando) {
            const timeout = setTimeout(() => setAnimando(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [animando]);

    return (
        <div className="relative flex flex-col items-center justify-center h-[500px] sm:h-[600px] w-full bg-[radial-gradient(circle,_#e6f8f7,_#ffffff)] dark:bg-[radial-gradient(circle,_#0a2e2d,_#000000)] transition">
            {/* Círculo decorativo */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-[#1cc2b5]/10 rounded-full blur-2xl animate-pulse" />

            {/* Número */}
            <div
                className={`
                    text-[160px] sm:text-[180px]
                    font-extrabold
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-br from-[#1cc2b5] to-[#0a9086]
                    transition-transform duration-300 ease-in-out
                    ${animando ? 'scale-125' : 'scale-100'}
                    drop-shadow-lg dark:drop-shadow-[0_0_25px_rgba(28,194,181,0.5)]
                    z-10
                `}
            >
                {contador}
            </div>

            {/* Texto debajo */}
            <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 z-10">
                Realizando sorteo...
            </p>
        </div>
    );
}
