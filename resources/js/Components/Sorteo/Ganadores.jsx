import GanadorCard from '@/Components/Sorteo/GanadorCard';
import { router } from '@inertiajs/react';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import { Crown, Users } from 'lucide-react';

export default function Ganadores({ ganadores, urlHost }) {
    const titulares = ganadores.filter(g => g.clasificacion === 'titular');
    const suplentes = ganadores.filter(g => g.clasificacion === 'suplente');

    const sorteoId = ganadores[0]?.sorteo_id;

    const ListaGanadores = ({ titulo, ganadores, icono: Icono }) => {
        if (ganadores.length === 0) return null;

        return (
            <div className="mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Icono className="w-6 h-6 text-[#1cc2b5]" />
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">{titulo}</h2>
                </div>
                <div className="grid gap-4">
                    {ganadores.map((g, i) => (
                        <GanadorCard
                            key={i}
                            nombre={g.nombre}
                            posicion={g.posicion}
                            comentario={g.comentario}
                            likes={g.likes}
                            fecha={g.fecha}
                            urlHost={urlHost}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="relative flex flex-col items-center justify-center w-full py-16 px-4 bg-[radial-gradient(circle,_#e6f8f7,_#ffffff)] dark:bg-[radial-gradient(circle,_#0a2e2d,_#000000)] transition">
            {/* Círculo decorativo */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-[#1cc2b5]/10 rounded-full blur-2xl animate-pulse" />

            {/* Contenido */}
            <div className="z-10 w-full max-w-2xl">
                <ListaGanadores titulo="Ganadores" ganadores={titulares} icono={Crown} urlHost={urlHost} />
                <ListaGanadores titulo="Suplentes" ganadores={suplentes} icono={Users} urlHost={urlHost} />

                {sorteoId && (
                    <div className="mt-8 text-center">
                        <BotonPrimario onClick={() => router.visit(route('sorteo.show', sorteoId))}>
                            Ver sorteo
                        </BotonPrimario>
                    </div>
                )}
            </div>
        </div>
    );
}
