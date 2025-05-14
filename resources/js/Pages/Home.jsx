import MainLayout from '@/Layouts/MainLayout';
import Publicacion from '@/Components/Publicacion/Publicacion';
import axios from '@/lib/axios';
import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Home() {
    const [url, setUrl] = useState('');
    const [publicacion, setPublicacion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { errors } = usePage().props;


    // e es el evento que desencadena la funcion.
    const handleSearch = async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la pagina al hacer submit
        setLoading(true);
        setError(null);
        setPublicacion(null);

        try {                                                            // forma simplificada de {url: url}
            const response = await axios.post(route('publicacion.buscar'), { url });
            setPublicacion(response.data); // response.data contiene el json que devuelve el metodo publicacion.buscar del controlador
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
        } finally {
            setLoading(false);
        }
    };

    const cargarComentarios = () => {
        // Route::post('/sorteo', ...                 // aqui no se usa la forma simplificada porque debe llamarse url
        router.post(route('publicacion.comentarios'), { url: publicacion.url });
        // Pasamos la publicacion.url y no la variable url (de useState) por si el usuario escribe otra cosa en el input antes de darle a cargar comentarios
    };

    return (
        <>
            <Head title="Home" />

            <div className="min-h-screen bg-gray-50 dark:bg-black text-black/70 dark:text-white/70">
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
                            placeholder="URL de YouTube o Bluesky"
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
                    {publicacion && (
                        <>
                            <div className="mt-8">
                                <Publicacion {...publicacion} />
                            </div>

                            <button
                                onClick={cargarComentarios}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Cargar comentarios
                            </button>
                        </>
                    )}

                    <div className="mt-12 text-center">
                        <Link
                            href={route('sorteo.manual')}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            También puedes realizar un sorteo manual.
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}

Home.layout = (page) => <MainLayout>{page}</MainLayout>;
