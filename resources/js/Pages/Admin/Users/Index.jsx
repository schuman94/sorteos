// resources/js/Pages/Admin/Usuarios/Index.jsx

import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ users }) {
    return (
        <>
            <Head title="Panel de Administración" />
            <div className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Usuarios registrados</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow rounded">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Sorteos realizados</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.sorteos_count}</td>
                                    <td className="p-3">
                                        <Link
                                            href={route('admin.users.show', user.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Ver detalles
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;
