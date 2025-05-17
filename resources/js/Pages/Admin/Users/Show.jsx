import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({ user }) {
    const { auth } = usePage().props;
    return (
        <>
            <Head title={`Usuario: ${user.name}`} />
            <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-bold">Información del Usuario</h2>
                    <p><strong>Nombre:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Rol:</strong> {user.is_admin ? 'Administrador' : 'Usuario'}</p>
                </div>

                <div className="bg-white rounded shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Acciones</h2>

                    <Link
                        href={route('admin.users.historial', user.id)}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-4"
                    >
                        Ver historial de sorteos
                    </Link>

                    <div className="flex gap-4">
                        {!user.is_admin ? (
                            <button
                                onClick={() => router.put(route('admin.users.hacer', user.id))}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                            >
                                Hacer administrador
                            </button>
                        ) : (
                            user.id !== auth.user.id && (
                                <button
                                    onClick={() => router.put(route('admin.users.deshacer', user.id))}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Deshacer administrador
                                </button>
                            )
                        )}
                    </div>

                </div>

            </div>
        </>
    );
}

Show.layout = (page) => <MainLayout>{page}</MainLayout>;
