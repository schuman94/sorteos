import React from 'react';
import GanadorCard from '@/Components/Sorteo/GanadorCard';

export default function Ganadores({ ganadores }) {
    // Separar titulares y suplentes
    const titulares = ganadores.filter(g => g.clasificacion === 'titular');
    const suplentes = ganadores.filter(g => g.clasificacion === 'suplente');

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
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Suplentes */}
            {suplentes.length > 0 && (
                <div>
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
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
