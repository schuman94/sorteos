import GanadorCard from '@/Components/Sorteo/GanadorCard';
import { router } from '@inertiajs/react';

export default function Ganadores({ ganadores, urlHost }) {
    // Separar titulares y suplentes
    const titulares = ganadores.filter(g => g.clasificacion === 'titular');
    const suplentes = ganadores.filter(g => g.clasificacion === 'suplente');

    const sorteoId = ganadores[0]?.sorteo_id;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Ganadores titulares */}
            {titulares.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-center mb-4">Ganadores</h2>
                    <div className="grid gap-4">
                        {titulares.map((g, i) => (
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
            )}

            {/* Suplentes */}
            {suplentes.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-center mb-4">Suplentes</h2>
                    <div className="grid gap-4">
                        {suplentes.map((g, i) => (
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
            )}

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
