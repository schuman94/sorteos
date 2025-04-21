// resources/js/Pages/Admin/Usuarios/Show.jsx

import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function Show({ user }) {
    return (
        <>
            <Head title={`Usuario: ${user.name}`} />
            <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-bold">Información del Usuario</h2>
                    <p><strong>Nombre:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>

                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Sorteos Realizados</h2>
                    {user.sorteos.length > 0 ? (
                        <ul className="space-y-3">
                            {user.sorteos.map((s) => (
                                <li key={s.id} className="border p-3 rounded">
                                    <a
                                        href={route('sorteo.show', s.id)}
                                        className="text-blue-600 hover:underline font-semibold"
                                    >
                                        {s.titulo}
                                    </a>
                                    <div className="text-sm text-gray-600">
                                        {s.tipo} | {new Date(s.created_at).toLocaleString()} | {s.num_participantes} participantes
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Este usuario aún no ha realizado sorteos.</p>
                    )}
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <MainLayout>{page}</MainLayout>;
