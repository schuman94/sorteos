import GanadorCard from '@/Components/Sorteo/GanadorCard';
import { router } from '@inertiajs/react';

export default function Ganadores({ ganadores, urlHost }) {
    // Separar titulares y suplentes
    const titulares = ganadores.filter(g => g.clasificacion === 'titular');
    const suplentes = ganadores.filter(g => g.clasificacion === 'suplente');

    const sorteoId = ganadores[0]?.sorteo_id;

    const ListaGanadores = ({ titulo, ganadores, urlHost }) => {
        if (ganadores.length === 0) return null;

        return (
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-center mb-4">{titulo}</h2>
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
        <div className="max-w-2xl mx-auto">
            <ListaGanadores titulo="Ganadores" ganadores={titulares} urlHost={urlHost} />
            <ListaGanadores titulo="Suplentes" ganadores={suplentes} urlHost={urlHost} />

            {/* Botón para ir al sorteo */}
            {sorteoId && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.visit(route('sorteo.show', sorteoId))}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
                    >
                        Ver sorteo
                    </button>
                </div>
            )}
        </div>
    );
}
