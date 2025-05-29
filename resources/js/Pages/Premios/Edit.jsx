import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import BotonPrimario from '@/Components/Botones/BotonPrimario';
import { PenSquare } from 'lucide-react';
import { useRef } from 'react';

export default function Edit({ premio }) {
    const fileInputRef = useRef();
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        nombre: premio.nombre || '',
        proveedor: premio.proveedor || '',
        valor: premio.valor || '',
        descripcion: premio.descripcion || '',
        link: premio.link || '',
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('premios.update', premio.id), {
            forceFormData: true,
        });
    };

    const handleFileChange = (e) => {
        setData('image', e.target.files[0]);
    };

    return (
        <>
            <Head title={`Editar premio: ${premio.nombre}`} />

            <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#1cc2b5] px-6 py-4 flex items-center gap-3">
                    <PenSquare className="w-6 h-6 text-white" />
                    <h1 className="text-xl font-semibold text-white">Editar premio</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                        />
                        {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proveedor</label>
                        <input
                            type="text"
                            id="proveedor"
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800"
                            value={data.proveedor}
                            onChange={(e) => setData('proveedor', e.target.value)}
                        />
                        {errors.proveedor && <p className="text-red-600 text-sm mt-1">{errors.proveedor}</p>}
                    </div>

                    <div>
                        <label htmlFor="valor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            id="valor"
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800"
                            value={data.valor}
                            onChange={(e) => setData('valor', e.target.value)}
                        />
                        {errors.valor && <p className="text-red-600 text-sm mt-1">{errors.valor}</p>}
                    </div>

                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                        <textarea
                            id="descripcion"
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 min-h-[100px] resize-y"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                        />
                        {errors.descripcion && <p className="text-red-600 text-sm mt-1">{errors.descripcion}</p>}
                    </div>

                    <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enlace (opcional)</label>
                        <input
                            type="url"
                            id="link"
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800"
                            value={data.link}
                            onChange={(e) => setData('link', e.target.value)}
                        />
                        {errors.link && <p className="text-red-600 text-sm mt-1">{errors.link}</p>}
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen (opcional)</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700"
                        />
                        {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}

                        {premio.imagen_url && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-1">Imagen actual:</p>
                                <img
                                    src={premio.thumbnail_url}
                                    alt="Imagen actual del premio"
                                    className="w-40 h-auto rounded-md border border-gray-300"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <BotonPrimario type="submit" disabled={processing}>
                            Actualizar premio
                        </BotonPrimario>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => <MainLayout>{page}</MainLayout>;
