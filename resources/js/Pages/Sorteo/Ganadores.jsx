import React from 'react';

export default function Ganadores({ ganadores }) {
    // Separar titulares y suplentes
    const titulares = ganadores.filter(g => g.clasificacion === 'titular');
    const suplentes = ganadores.filter(g => g.clasificacion === 'suplente');

    // Componente individual
    const GanadorCard = ({ nombre, posicion }) => (
        <div className="w-full max-w-sm mx-auto flex items-center justify-between p-4 bg-white dark:bg-gray-700 border rounded shadow-sm">
            <div className="flex items-center gap-4">
                <div className="text-green-600 font-bold text-xl">{posicion}</div>
                <div className="text-lg font-semibold">{nombre}</div>
            </div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            {/* Ganadores titulares */}
            {titulares.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-center mb-4">Ganadores</h2>
                    <div className="space-y-4">
                        {titulares.map((g, i) => (
                            <GanadorCard key={i} nombre={g.nombre} posicion={g.posicion} />
                        ))}
                    </div>
                </div>
            )}

            {/* Suplentes */}
            {suplentes.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-center mb-4">Suplentes</h2>
                    <div className="space-y-4">
                        {suplentes.map((g, i) => (
                            <GanadorCard key={i} nombre={g.nombre} posicion={g.posicion} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
