import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Edit({ premio }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: premio.nombre || '',
        proveedor: premio.proveedor || '',
        valor: premio.valor || '',
        descripcion: premio.descripcion || '',
        link: premio.link || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('premios.update', premio.id));
    };

    return (
        <>
            <Head title={`Editar premio: ${premio.nombre}`} />

            <div className="max-w-3xl mx-auto py-12 px-4">
                <h1 className="text-2xl font-bold mb-6">Editar premio</h1>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow p-6 rounded">
                    <div>
                        <label htmlFor="nombre" className="block font-medium mb-1">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            className="input w-full"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                        />
                        {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label htmlFor="proveedor" className="block font-medium mb-1">Proveedor</label>
                        <input
                            type="text"
                            id="proveedor"
                            className="input w-full"
                            value={data.proveedor}
                            onChange={(e) => setData('proveedor', e.target.value)}
                        />
                        {errors.proveedor && <p className="text-red-600 text-sm mt-1">{errors.proveedor}</p>}
                    </div>

                    <div>
                        <label htmlFor="valor" className="block font-medium mb-1">Valor (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            id="valor"
                            className="input w-full"
                            value={data.valor}
                            onChange={(e) => setData('valor', e.target.value)}
                        />
                        {errors.valor && <p className="text-red-600 text-sm mt-1">{errors.valor}</p>}
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block font-medium mb-1">Descripción</label>
                        <textarea
                            id="descripcion"
                            className="input w-full"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                        />
                        {errors.descripcion && <p className="text-red-600 text-sm mt-1">{errors.descripcion}</p>}
                    </div>

                    <div>
                        <label htmlFor="link" className="block font-medium mb-1">Enlace (opcional)</label>
                        <input
                            type="url"
                            id="link"
                            className="input w-full"
                            value={data.link}
                            onChange={(e) => setData('link', e.target.value)}
                        />
                        {errors.link && <p className="text-red-600 text-sm mt-1">{errors.link}</p>}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                            disabled={processing}
                        >
                            Actualizar premio
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => <MainLayout>{page}</MainLayout>;
