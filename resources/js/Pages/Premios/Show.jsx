import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Show({ premio }) {
    return (
        <>
            <Head title={`Premio: ${premio.nombre}`} />

            <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
                <h1 className="text-3xl font-bold">{premio.nombre}</h1>

                <div className="bg-white shadow rounded p-6 space-y-4">
                    <div>
                        <strong>Proveedor:</strong> {premio.proveedor}
                    </div>
                    <div>
                        <strong>Valor:</strong> {premio.valor} €
                    </div>
                    <div>
                        <strong>Descripción:</strong> {premio.descripcion || 'Sin descripción'}
                    </div>
                    <div>
                        <strong>Link:</strong>{' '}
                        {premio.link ? (
                            <a href={premio.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                                Ver enlace
                            </a>
                        ) : (
                            'No disponible'
                        )}
                    </div>
                    <div>
                        <strong>Creado:</strong> {new Date(premio.created_at).toLocaleString('es-ES')}
                    </div>
                </div>
            </div>
        </>
    );
}
