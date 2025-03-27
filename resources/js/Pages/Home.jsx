import React, { useState } from 'react';
import { router, Head, Link, usePage } from '@inertiajs/react';

export default function Home({ auth, publicacionData }) {
    const [url, setUrl] = useState('');
    const { errors } = usePage().props;

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('publicacion.buscar'), { url });
    };

    return (
        <>
            <Head title="Home" />

            <div className="min-h-screen bg-gray-50 dark:bg-black text-black/70 dark:text-white/70">
                <header className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-xl">Mi App de Sorteos</span>
                    </div>

                    <nav>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="px-4 py-2">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-4 py-2">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="px-4 py-2">
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="flex flex-col items-center justify-center py-16">
                    <h1 className="text-3xl font-semibold mb-4">
                        Sorteo en YouTube
                    </h1>

                    <p className="mb-6 text-center max-w-md">
                        Introduce la URL de un video o publicación para realizar un sorteo.
                    </p>

                    <form onSubmit={handleSearch} className="w-full max-w-sm flex gap-2">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 rounded border px-3 py-2"
                            placeholder="URL de YouTube o Instagram"
                        />
                        <button
                            type="submit"
                            className="rounded bg-red-600 px-4 py-2 text-white"
                        >
                            Buscar
                        </button>
                    </form>

                    {/* Muestra el error si existe */}
                    {errors.url && (
                        <div className="mt-4 text-red-600">
                            {errors.url}
                        </div>
                    )}

                    {/* Si se han recibido datos de la publicación, se muestran en esta sección */}
                    {publicacionData && (
                        <div className="mt-8 max-w-md p-4 border rounded">
                            {publicacionData.titulo && (
                                <p>
                                    <strong>Título:</strong> {publicacionData.titulo}
                                </p>
                            )}
                            <p>
                                <strong>Autor:</strong> {publicacionData.autor}
                            </p>
                            <p>
                                <strong>Comentarios:</strong> {publicacionData.numComentarios}
                            </p>
                            <p>
                                <strong>Likes:</strong> {publicacionData.likes}
                            </p>
                            <p>
                                <strong>Fecha:</strong> {publicacionData.fechaPublicacion}
                            </p>
                            {publicacionData.visualizaciones && (
                                <p>
                                    <strong>Visualizaciones:</strong> {publicacionData.visualizaciones}
                                </p>
                            )}
                        </div>
                    )}

                </main>

                <footer className="text-center py-4 text-sm">
                    {/* Pie de página */}
                </footer>
            </div>
        </>
    );
}
