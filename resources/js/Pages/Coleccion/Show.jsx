import { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import axios from 'axios';
import { formatearFecha as ff } from '@/utils/fecha';

export default function Show({ coleccion, rascas_disponibles }) {
    const [cantidad, setCantidad] = useState(1);
    const [urls, setUrls] = useState([]);
    const [error, setError] = useState(null);

    const handleObtenerRascas = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(route('colecciones.proporcionarRascas', coleccion.id), {
                cantidad,
            });
            setUrls(response.data.urls);
            setError(null);
        } catch (err) {
            if (err.response?.status === 422) {
                setError(err.response.data.errors?.cantidad?.[0] || 'Error al validar');
            }
        }
    };

    const copiarAlPortapapeles = async () => {
        await navigator.clipboard.writeText(urls.join('\n'));
        alert('Copiado al portapapeles');
    };

    return (
        <>
            <Head title="Colección" />

            <div className="max-w-6xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center">{coleccion.nombre}</h1>

                <div className="space-y-4">
                    <div><strong>Descripción:</strong> <p>{coleccion.descripcion}</p></div>
                    <div><strong>Fecha de creación:</strong> <p>{ff(coleccion.created_at)}</p></div>
                </div>

                {rascas_disponibles > 0 ? (
                    <form onSubmit={handleObtenerRascas} className="space-y-4">
                        <label className="block font-medium">Número de rascas a obtener (quedan {rascas_disponibles})</label>

                        <div className="flex flex-col items-start space-y-2">
                            <input
                                type="number"
                                value={cantidad}
                                onChange={e => setCantidad(Number(e.target.value))}
                                min={1}
                                max={9999}
                                className="border rounded px-3 py-2 w-32"
                            />

                            {error && (
                                <p className="text-red-600 text-sm">{error}</p>
                            )}

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Obtener rascas
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-red-600 font-medium">No quedan rascas disponibles en esta colección.</p>
                )}

                {urls.length > 0 && (
                    <div className="space-y-2">
                        <label className="block font-medium">Códigos generados</label>
                        <textarea
                            readOnly
                            rows={Math.min(10, urls.length)}
                            className="w-full border rounded p-2 font-mono text-sm"
                            value={urls.join('\n')}
                        />
                        <button
                            onClick={copiarAlPortapapeles}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Copiar al portapapeles
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}


Show.layout = page => <MainLayout>{page}</MainLayout>;
