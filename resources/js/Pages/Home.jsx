import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from '../lib/axios';
import Data from './Publicacion/Data';

export default function Home({ auth, publicacionDataSession}) {
    const [url, setUrl] = useState('');
    const [publicacionData, setPublicacionData] = useState(publicacionDataSession);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { errors } = usePage().props;

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPublicacionData(null);

        try {
            const response = await axios.post('/buscar-publicacion', { url });
            setPublicacionData(response.data);
        } catch (err) {
            if (err.response && err.response.data) {
                // Errores del validate del controlador
                if (err.response.data.errors && err.response.data.errors.url) {
                    setError(err.response.data.errors.url[0]);
                }
                // Errores personalizados del try/catch del controlador
                else if (err.response.data.error) {
                    setError(err.response.data.error);
                }
            } else {
                setError('Error desconocido al buscar la publicación');
            }
        }
         finally {
            setLoading(false);
        }
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
                    <h1 className="text-3xl font-semibold mb-4">Sorteo en redes</h1>

                    <p className="mb-6 text-center max-w-md">
                        Introduce la URL de una publicación para realizar un sorteo.
                    </p>

                    <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm"
                            placeholder="URL de YouTube o Instagram"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-red-700 transition"
                            disabled={loading}
                        >
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>

                    {/* Errores de validación en el controlador*/}
                    {errors.url && <div className="mt-4 text-red-600">{errors.url}</div>}
                    {/* Errores obtenidos del try/catch del controlador o algo desconocido */}
                    {error && <div className="mt-4 text-red-600">{error}</div>}

                    {/* Mostrar los datos de la publicación si existen */}
                    {publicacionData && (
                        <div className="mt-8">
                            <Data {...publicacionData} />
                        </div>
                    )}
                </main>

                <footer className="text-center py-4 text-sm">

                </footer>
            </div>
        </>
    );
}
