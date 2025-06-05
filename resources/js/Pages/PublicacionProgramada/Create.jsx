import { useForm, Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import { useEffect, useState } from 'react';

export default function Create({ urls, coleccion }) {
    const [mostrarIntervalo, setMostrarIntervalo] = useState(urls.length > 1);

    const { data, setData, post, processing, errors } = useForm({
        mensaje_base: '¡Nuevo rasca disponible!',
        inicio: '',
        intervalo: 1,
        unidad_intervalo: 'horas',
        urls,
        coleccion_id: coleccion.id,
    });

    useEffect(() => {
        setMostrarIntervalo(urls.length > 1);
    }, [urls]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('publicaciones.programar'));
    };

    return (
        <>
            <Head title="Programar publicación" />

            <div className="max-w-2xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800 text-center">
                    Programar publicaciones de la colección: <span className="text-[#1cc2b5]">{coleccion.nombre}</span>
                </h1>


                <form onSubmit={handleSubmit} className="space-y-6 bg-white border p-6 rounded shadow-sm">
                    <div>
                        <label className="block font-medium text-gray-700">Mensaje base</label>
                        <textarea
                            value={data.mensaje_base}
                            onChange={(e) => setData('mensaje_base', e.target.value)}
                            className="w-full border rounded p-2 mt-1"
                            rows={3}
                        />
                        {errors.mensaje_base && (
                            <p className="text-sm text-red-600 mt-1">{errors.mensaje_base}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700">Fecha y hora de inicio</label>
                        <input
                            type="datetime-local"
                            value={data.inicio}
                            onChange={(e) => setData('inicio', e.target.value)}
                            className="border rounded px-3 py-2 mt-1"
                        />
                        {errors.inicio && (
                            <p className="text-sm text-red-600 mt-1">{errors.inicio}</p>
                        )}
                    </div>

                    {mostrarIntervalo && (
                        <>
                            <div>
                                <label className="block font-medium text-gray-700">Intervalo entre publicaciones</label>
                                <input
                                    type="number"
                                    value={data.intervalo}
                                    onChange={(e) => setData('intervalo', parseInt(e.target.value))}
                                    min={1}
                                    max={10080}
                                    className="border rounded px-3 py-2 mt-1 w-32"
                                />
                                {errors.intervalo && (
                                    <p className="text-sm text-red-600 mt-1">{errors.intervalo}</p>
                                )}
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700">Unidad del intervalo</label>
                                <select
                                    value={data.unidad_intervalo}
                                    onChange={(e) => setData('unidad_intervalo', e.target.value)}
                                    className="border rounded px-3 py-2 mt-1 w-32"
                                >
                                    <option value="horas">Horas</option>
                                    <option value="minutos">Minutos</option>
                                </select>
                                {errors.unidad_intervalo && (
                                    <p className="text-sm text-red-600 mt-1">{errors.unidad_intervalo}</p>
                                )}
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block font-medium text-gray-700">Rascas a publicar</label>
                        <textarea
                            readOnly
                            value={urls.join('\n')}
                            className="w-full border rounded p-2 font-mono text-sm mt-1"
                            rows={Math.min(10, urls.length)}
                        />
                        {errors.urls && (
                            <p className="text-sm text-red-600 mt-1">{errors.urls}</p>
                        )}
                    </div>

                    <BotonPrimario type="submit" disabled={processing}>
                        Programar
                    </BotonPrimario>
                </form>
            </div>
        </>
    );
}

Create.layout = page => <MainLayout>{page}</MainLayout>;
