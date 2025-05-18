import { useForm, Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { formatearFecha as ff } from '@/utils/fecha';
import { formatearDinero as dinero } from '@/utils/dinero';

export default function Show({ coleccion, urls }) {
    const { data, setData, post, processing, errors } = useForm({ cantidad: 1 });
    const quedanRascasSinRascar = coleccion.total_rascas - coleccion.total_rascados > 0;

    const obtenerRascas = (e) => {
        e.preventDefault();
        post(route('colecciones.proporcionarRascas', coleccion.id), {
            preserveScroll: true,
        });
    };

    const copiarAlPortapapeles = async () => {
        await navigator.clipboard.writeText(urls.join('\n'));
        alert('Copiado al portapapeles');
    };

    return (
        <>
            <Head title="Colección" />
            <div className="max-w-6xl mx-auto p-6 space-y-8">

                <h1 className="text-3xl font-bold text-center text-gray-800">{coleccion.nombre}</h1>

                <div className="space-y-4">

                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-600 mb-1">Descripción</h2>
                        <p className="text-gray-800 whitespace-pre-line">{coleccion.descripcion}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                            <h2 className="text-sm font-semibold text-gray-600 mb-1">Fecha de creación</h2>
                            <p className="text-gray-800">{ff(coleccion.created_at)}</p>
                        </div>

                        <div className="bg-white border rounded-lg p-4 shadow-sm space-y-2">
                            <h2 className="text-sm font-semibold text-gray-600 mb-1">Estado</h2>
                            <div className="flex items-center">
                                {coleccion.abierta || (coleccion.total_rascas - coleccion.total_rascados > 0) ? (
                                    <button
                                        onClick={() => router.put(route('colecciones.toggleEstado', coleccion.id), {}, { preserveScroll: true })}
                                        className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none transition-colors ${coleccion.abierta
                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                            }`}
                                    >
                                        {coleccion.abierta ? 'Abierta' : 'Cerrada'}
                                    </button>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-600 cursor-not-allowed">
                                        Cerrada
                                    </span>
                                )}
                            </div>

                        </div>

                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center text-sm">
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="font-semibold text-gray-600">Rascas totales</p>
                        <p className="text-lg text-gray-800">{coleccion.total_rascas}</p>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="font-semibold text-gray-600">Proporcionados</p>
                        <p className="text-lg text-gray-800">{coleccion.total_proporcionados}</p>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="font-semibold text-gray-600">Restantes</p>
                        <p className="text-lg text-gray-800">{coleccion.rascas_restantes}</p>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="font-semibold text-gray-600">Rascados</p>
                        <p className="text-lg text-gray-800">{coleccion.total_rascados}</p>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="font-semibold text-gray-600">Premios obtenidos</p>
                        <p className="text-lg text-gray-800">{coleccion.premios_obtenidos}</p>
                    </div>
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="font-semibold text-gray-600">Premios restantes</p>
                        <p className="text-lg text-gray-800">{coleccion.premios_restantes}</p>
                    </div>
                </div>


                <div className="text-center">
                    <Link
                        href={route('colecciones.rascasProporcionados', coleccion.id)}
                        className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded"
                    >
                        Ver rascas proporcionados
                    </Link>
                </div>

                {coleccion.abierta && coleccion.rascas_restantes > 0 && (
                    <form onSubmit={obtenerRascas} className="bg-white border rounded-lg p-6 space-y-6 shadow-sm">
                        <div className="space-y-2">
                            <label className="block font-medium text-gray-800">Número de rascas a obtener</label>
                            <input
                                type="number"
                                value={data.cantidad}
                                onChange={e => setData('cantidad', e.target.value)}
                                min={1}
                                max={9999}
                                className="border rounded px-3 py-2 w-32"
                            />
                            {errors.cantidad && (
                                <p className="text-red-600 text-sm">{errors.cantidad}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                        >
                            Obtener rascas
                        </button>
                    </form>
                )}

                {urls.length > 0 && (
                    <div className="bg-white border rounded-lg p-6 space-y-4 shadow-sm">
                        <label className="block font-medium text-gray-800">Códigos generados</label>
                        <textarea
                            readOnly
                            rows={Math.min(10, urls.length)}
                            className="w-full border rounded p-2 font-mono text-sm"
                            value={urls.join('\n')}
                        />
                        <button
                            onClick={copiarAlPortapapeles}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                        >
                            Copiar al portapapeles
                        </button>
                    </div>
                )}

                {coleccion.premios?.length > 0 && (
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Premios de la colección</h2>
                        <div className="overflow-auto">
                            <table className="min-w-full border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-3 py-2 text-left">Nombre</th>
                                        <th className="border px-3 py-2 text-left">Proveedor</th>
                                        <th className="border px-3 py-2 text-left">Enlace</th>
                                        <th className="border px-3 py-2 text-right">Cantidad</th>
                                        <th className="border px-3 py-2 text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coleccion.premios.map((p, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="border px-3 py-2">
                                                <Link
                                                    href={route('premios.show', p.id)}
                                                    className="text-blue-600 underline hover:text-blue-800"
                                                >
                                                    {p.nombre}
                                                </Link>
                                            </td>

                                            <td className="border px-3 py-2">{p.proveedor}</td>
                                            <td className="border px-3 py-2">
                                                {p.link ? (
                                                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                                        Ver enlace
                                                    </a>
                                                ) : '—'}
                                            </td>
                                            <td className="border px-3 py-2 text-right">{p.cantidad}</td>
                                            <td className="border px-3 py-2 text-right">{dinero(p.valor_total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-100 font-semibold">
                                        <td colSpan="4" className="px-3 py-2 text-right">Valor total:</td>
                                        <td className="px-3 py-2 text-right">{dinero(coleccion.valor_total)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Show.layout = page => <MainLayout>{page}</MainLayout>;
