import MainLayout from '@/Layouts/MainLayout';
import Publicacion from '@/Components/Publicacion/Publicacion';
import axios from '@/lib/axios';
import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Ticket, LifeBuoy } from 'lucide-react';

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
            <Head title="Sorteo en redes" />

            <div className="min-h-screen bg-gray-50 dark:bg-black text-black/70 dark:text-white/70">
                <main className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    {/* Encabezado principal */}
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="bg-[#1cc2b5]/10 p-4 rounded-full">
                            <img src="/assets/logo-sorteillo.svg" alt="Sorteillo Logo" className="h-11 w-auto" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sorteo en redes</h1>
                        <p className="max-w-xl text-base text-gray-600 dark:text-gray-400">
                            Elige un ganador entre los comentarios de un video/short de <strong>YouTube</strong> o un post de <strong>BlueSky</strong>. Próximamente disponible para posts de <strong>Instagram</strong>.
                        </p>
                    </div>

                    {/* Buscador de URL */}
                    <form onSubmit={handleSearch} className="w-full max-w-lg flex flex-col sm:flex-row gap-4 items-stretch">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 rounded-lg border-2 border-[#1cc2b5] px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1cc2b5]"
                            placeholder="URL de YouTube o Bluesky"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-[#1cc2b5] px-6 py-3 text-sm font-semibold text-white hover:bg-[#17b0a6] transition"
                            disabled={loading}
                        >
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>

                    {/* Errores */}
                    {errors.url && <div className="mt-4 text-red-600">{errors.url}</div>}
                    {error && <div className="mt-4 text-red-600">{error}</div>}

                    {/* Resultado */}
                    {publicacion && (
                        <>
                            <div className="mt-12">
                                <Publicacion {...publicacion} />
                            </div>
                            <button
                                onClick={cargarComentarios}
                                className="mt-4 px-6 py-2 bg-[#1cc2b5] text-white rounded hover:bg-[#17b0a6] transition"
                            >
                                Cargar comentarios
                            </button>
                        </>
                    )}

                    {/* Sección informativa */}
                    <section className="mt-20 max-w-2xl text-left">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">¿Cómo funciona?</h2>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 text-sm space-y-2">
                            <li>Introduce la URL de una publicación de YouTube o Bluesky.</li>
                            <li>Visualiza sus comentarios antes de iniciar el sorteo.</li>
                            <li>Aplica filtros (hashtags, menciones, duplicados...)</li>
                            <li>Selecciona ganadores y suplentes con cuenta atrás animada.</li>
                        </ul>
                    </section>

                    {/* Sorteo manual */}
                    <div className="mt-12">
                        <Link href={route('sorteo.manual')} className="text-[#1cc2b5] hover:underline text-sm font-medium">
                            ¿Ya tienes la lista de participantes? También puedes hacer un sorteo manual →
                        </Link>
                    </div>

                    {/* Otras herramientas */}
                    <section className="mt-16 w-full max-w-4xl text-center">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Prueba nuestras otras herramientas</h2>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href={route('colecciones.index')}
                                className="group flex-1 px-6 py-4 bg-white border-2 border-[#1cc2b5] rounded-lg shadow hover:bg-[#1cc2b5] hover:text-white transition"
                            >
                                <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-2">
                                    <Ticket className="w-5 h-5" />
                                    <span>Rascas</span>
                                </div>
                                <p className="text-sm text-gray-500 group-hover:text-white transition text-center">
                                    Crea colecciones de rascas con premios ocultos y compártelos en tus redes sociales.
                                </p>
                            </Link>

                            <Link
                                href={route('ruleta')}
                                className="group flex-1 px-6 py-4 bg-white border-2 border-[#1cc2b5] rounded-lg shadow hover:bg-[#1cc2b5] hover:text-white transition"
                            >
                                <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-2">
                                    <LifeBuoy className="w-5 h-5" />
                                    <span>Ruleta</span>
                                </div>
                                <p className="text-sm text-gray-500 group-hover:text-white transition text-center">
                                    Introduce diferentes opciones y haz girar la ruleta. Guarda tus ruletas favoritas para reutilizarlas.
                                </p>
                            </Link>
                        </div>
                    </section>
                </main>
            </div>

        </>
    );
}

Home.layout = (page) => <MainLayout>{page}</MainLayout>;
