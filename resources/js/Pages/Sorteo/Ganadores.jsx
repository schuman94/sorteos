import React from 'react';

export default function Ganadores({ ganadores }) {
    // Separar titulares y suplentes
    const titulares = ganadores.filter(g => g.clasificacion === 'titular');
    const suplentes = ganadores.filter(g => g.clasificacion === 'suplente');

    // Componente individual para mostrar un ganador
    const GanadorCard = ({ nombre, posicion, comentario, likes, fecha }) => (
        <div className="p-4 bg-white dark:bg-gray-700 border rounded shadow-sm space-y-1">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Posición</span>
                <span className="text-pink-600 font-bold text-lg">{posicion}</span>
            </div>
            <div className="text-base font-semibold">{nombre}</div>

            {comentario && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    <p className="mb-1 italic">“{comentario}”</p>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>👍 {likes ?? 0}</span>
                        <span>{new Date(fecha).toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );

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
