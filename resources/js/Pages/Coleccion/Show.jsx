import { useForm, Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { formatearFecha as ff } from '@/utils/fecha';
import { formatearDinero as dinero } from '@/utils/dinero';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import BotonRojo from '@/Components/Botones/BotonRojo';
import BotonGris from '@/Components/Botones/BotonGris';

export default function Show({ coleccion, urls }) {
    const { data, setData, post, processing, errors } = useForm({ cantidad: 1 });

    const obtenerRascas = (e) => {
        e.preventDefault();
        post(route('colecciones.proporcionarRascas', coleccion.id), {
            preserveScroll: true,
        });
    };

    const copiarAlPortapapeles = async () => {
        await navigator.clipboard.writeText(urls.join('\n'));
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
                                    coleccion.abierta ? (
                                        <BotonPrimario
                                            className="!text-sm !px-3 !py-1 !rounded-full"
                                            onClick={() =>
                                                router.put(
                                                    route('colecciones.toggleEstado', coleccion.id),
                                                    {},
                                                    { preserveScroll: true }
                                                )
                                            }
                                        >
                                            Abierta
                                        </BotonPrimario>
                                    ) : (
                                        <BotonRojo
                                            className="!text-sm !px-3 !py-1 !rounded-full"
                                            onClick={() =>
                                                router.put(
                                                    route('colecciones.toggleEstado', coleccion.id),
                                                    {},
                                                    { preserveScroll: true }
                                                )
                                            }
                                        >
                                            Cerrada
                                        </BotonRojo>
                                    )
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
                        className="inline-block bg-[#1cc2b5] hover:bg-[#17b0a6] text-white font-semibold py-2 px-6 rounded-md shadow-sm active:scale-95 transition-transform duration-100 ease-in-out"
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

                        <BotonPrimario type="submit" disabled={processing}>
                            Obtener rascas
                        </BotonPrimario>
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
                        <BotonPrimario
                            onClick={copiarAlPortapapeles}
                            className="active:scale-95 transition duration-100 ease-in-out"
                        >
                            Copiar
                        </BotonPrimario>

                    </div>
                )}

                {coleccion.premios?.length > 0 && (
                    <div className="bg-white border rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Premios de la colección</h2>
                        <div className="overflow-auto">
    <table className="min-w-full text-sm bg-white shadow border border-[#1cc2b5] rounded-md overflow-hidden">
        <thead className="bg-[#1cc2b5] text-white">
            <tr>
                <th className="px-3 py-2 text-left">Nombre</th>
                <th className="px-3 py-2 text-left">Proveedor</th>
                <th className="px-3 py-2 text-right">Cantidad</th>
                <th className="px-3 py-2 text-right">Valor</th>
            </tr>
        </thead>
        <tbody>
            {coleccion.premios.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                    <td className="border-t border-gray-200 px-3 py-2">
                        <Link
                            href={route('premios.show', p.id)}
                            className="text-[#1cc2b5] underline hover:text-[#17b0a6]"
                        >
                            {p.nombre}
                        </Link>
                    </td>
                    <td className="border-t border-gray-200 px-3 py-2">{p.proveedor}</td>
                    <td className="border-t border-gray-200 px-3 py-2 text-right">{p.cantidad}</td>
                    <td className="border-t border-gray-200 px-3 py-2 text-right">{dinero(p.valor_total)}</td>
                </tr>
            ))}
        </tbody>
        <tfoot>
            <tr className="bg-gray-100 font-semibold text-gray-700">
                <td colSpan="3" className="px-3 py-2 text-right">Valor total:</td>
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
