import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ModalEliminacion from '@/Components/ModalEliminacion';
import { User, Mail, Shield, Trash, ShieldOff, ShieldCheck, Clock } from 'lucide-react';

export default function Show({ user }) {
    const { auth } = usePage().props;
    const [mostrarModal, setMostrarModal] = useState(false);

    const eliminarUsuario = () => {
        router.delete(route('admin.users.destroy', user.id), {
            preserveScroll: true,
            onFinish: () => setMostrarModal(false),
        });
    };

    return (
        <>
            <Head title={`Usuario: ${user.name}`} />

            <ModalEliminacion
                visible={mostrarModal}
                titulo="¿Eliminar usuario?"
                mensaje="Esta acción eliminará al usuario permanentemente. ¿Deseas continuar?"
                error
                onCancelar={() => setMostrarModal(false)}
                onConfirmar={eliminarUsuario}
            />

            <div className="max-w-5xl mx-auto py-12 px-4 space-y-10">

                {/* Información del usuario */}
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
                        <User className="w-6 h-6 text-gray-800" />
                        Información del Usuario
                    </h2>
                    <div className="space-y-2 text-gray-700">
                        <p className="flex items-center gap-2">
                             <User className="w-4 h-4 text-gray-400" />
                            <span>{user.name}</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{user.email}</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span>{user.is_admin ? 'Administrador' : 'Usuario'}</span>
                        </p>
                    </div>
                </div>

                {/* Acciones disponibles */}
                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
                        <ShieldCheck className="w-6 h-6 text-gray-800" />
                        Acciones
                    </h2>

                    <div>
                        <Link
                            href={route('admin.users.historial', user.id)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                        >
                            <Clock className="w-4 h-4" />
                            Historial de sorteos
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {!user.is_admin && (
                            <button
                                onClick={() => router.put(route('admin.users.hacer', user.id))}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Hacer administrador
                            </button>
                        )}

                        {user.is_admin && user.id !== auth.user.id && (
                            <button
                                onClick={() => router.put(route('admin.users.deshacer', user.id))}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <ShieldOff className="w-4 h-4" />
                                Quitar permisos
                            </button>
                        )}

                        {user.id !== auth.user.id && (
                            <button
                                onClick={() => setMostrarModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <Trash className="w-4 h-4" />
                                Eliminar usuario
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = (page) => <MainLayout>{page}</MainLayout>;
