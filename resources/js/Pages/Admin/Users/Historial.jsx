import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import SorteoCard from '@/Components/Sorteo/SorteoCard';
import FiltroHistorial from '@/Components/Sorteo/FiltroHistorial';

export default function Historial({ user, sorteos, hosts, anyos, anyoSeleccionado, tipoSeleccionado }) {
    const handleFilterChange = (e) => {
        const params = {
            anyo: document.getElementById('anyo').value,
            tipo: document.getElementById('tipo').value,
        };

        router.get(route('admin.users.historial', user.id), params, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Historial de Sorteos - ${user.name}`} />

            <div className="max-w-5xl mx-auto py-12 px-4">
                <FiltroHistorial
                    anyoSeleccionado={anyoSeleccionado}
                    tipoSeleccionado={tipoSeleccionado}
                    anyos={anyos}
                    hosts={hosts}
                    onChange={handleFilterChange}
                />

                {sorteos.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {sorteos.map((sorteo) => (
                            <SorteoCard key={sorteo.id} sorteo={sorteo} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No hay sorteos disponibles para este usuario.</p>
                )}
            </div>
        </>
    );
}

Historial.layout = (page) => <MainLayout>{page}</MainLayout>;
