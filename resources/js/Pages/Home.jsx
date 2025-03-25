import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Home({ auth }) {
    const [videoUrl, setVideoUrl] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Buscando video:', videoUrl);
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
                        Introduce la URL de un video para realizar un sorteo.
                    </p>

                    <form onSubmit={handleSearch} className="w-full max-w-sm flex gap-2">
                        <input
                            type="text"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="flex-1 rounded border px-3 py-2"
                            placeholder="URL del video de YouTube"
                        />
                        <button
                            type="submit"
                            className="rounded bg-red-600 px-4 py-2 text-white"
                        >
                            Buscar
                        </button>
                    </form>
                </main>

                <footer className="text-center py-4 text-sm">

                </footer>
            </div>
        </>
    );
}
