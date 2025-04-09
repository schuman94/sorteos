import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import Ganadores from '@/Components/Sorteo/Ganadores';
import Filtro from '@/Components/Sorteo/Filtro';

export default function Show({ sorteo }) {
    return (
        <>
            <Head title={`Sorteo: ${sorteo.titulo}`} />

            <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white break-words mb-4">
                        <a
                            href={sorteo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {sorteo.titulo}
                        </a>
                    </h2>

                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p><strong>Fecha:</strong> {new Date(sorteo.created_at).toLocaleString()}</p>
                        <p><strong>Participantes:</strong> {sorteo.num_participantes}</p>
                        <p><strong>Tipo:</strong> {sorteo.tipo.split('\\').pop()}</p>
                    </div>
                </div>

                <Filtro filtro={sorteo.filtro} />

                <Ganadores ganadores={sorteo.ganadores} tipo={sorteo.tipo} />
            </div>
        </>
    );
}

Show.layout = (page) => <MainLayout>{page}</MainLayout>;
