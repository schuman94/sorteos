import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import SorteoCard from '@/Components/Sorteo/SorteoCard';

export default function Historial({ sorteos, anyos, anyoSeleccionado, tipoSeleccionado }) {
    const handleFilterChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        const params = {
            anyo: document.getElementById('anyo').value,
            tipo: document.getElementById('tipo').value
        };

        router.get(route('sorteo.historial'), params, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Historial" />

            <div className="max-w-5xl mx-auto py-12 px-4">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h1 className="text-2xl font-semibold">Historial de Sorteos</h1>

                    <div className="flex gap-4">
                        <select
                            id="anyo"
                            name="anyo"
                            value={anyoSeleccionado || ''}
                            onChange={handleFilterChange}
                            className="rounded border-gray-300 text-sm shadow-sm"
                        >
                            {anyos.map((a) => (
                                <option key={a} value={a}>
                                    {a}
                                </option>
                            ))}
                        </select>

                        <select
                            id="tipo"
                            name="tipo"
                            value={tipoSeleccionado || ''}
                            onChange={handleFilterChange}
                            className="rounded border-gray-300 text-sm shadow-sm"
                        >
                            <option value="">Todos</option>
                            <option value="App\Domain\YouTubeVideo">YouTube</option>
                            <option value="App\Domain\InstagramPost">Instagram</option>
                        </select>
                    </div>
                </div>

                {sorteos.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {sorteos.map((sorteo) => (
                            <SorteoCard key={sorteo.id} sorteo={sorteo} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No hay sorteos disponibles.</p>
                )}
            </div>
        </>
    );
}

Historial.layout = (page) => <MainLayout>{page}</MainLayout>;
