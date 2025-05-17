import { useForm, Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { formatearFecha as ff } from '@/utils/fecha';

export default function Show({ coleccion, urls }) {
    const { data, setData, post, processing, errors } = useForm({
        cantidad: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('colecciones.proporcionarRascas', coleccion.id));
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
                    <div><strong>Rascas restantes:</strong> {coleccion.rascas_restantes}</div>
                </div>

                <Link
                    href={route('colecciones.rascasProporcionados', coleccion.id)}
                    className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Ver rascas proporcionados
                </Link>

                {coleccion.rascas_restantes > 0 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium">Número de rascas a obtener</label>
                            <input
                                type="number"
                                value={data.cantidad}
                                onChange={e => setData('cantidad', e.target.value)}
                                min={1}
                                max={9999}
                                className="border rounded px-3 py-2 w-32"
                            />
                            {errors.cantidad && (
                                <p className="text-red-600 text-sm mt-1">{errors.cantidad}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Obtener rascas
                        </button>
                    </form>
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
