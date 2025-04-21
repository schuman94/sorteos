import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ users }) {
    return (
        <>
            <Head title="Panel de Administración" />
            <div className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6">Usuarios registrados</h1>

                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
                            <tr>
                                <th className="p-3 text-left">Nombre</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Sorteos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <Link
                                    as="tr"
                                    href={route('admin.users.show', user.id)}
                                    key={user.id}
                                    className="border-b hover:bg-gray-50 cursor-pointer transition"
                                >
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.sorteos_count}</td>
                                </Link>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <MainLayout>{page}</MainLayout>;
