import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

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
                    <h2 className="text-xl font-bold mb-4">Acciones</h2>
                    <Link
                        href={route('admin.users.historial', user.id)}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Ver historial de sorteos
                    </Link>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <MainLayout>{page}</MainLayout>;
