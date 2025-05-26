import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { TicketCheck } from 'lucide-react';
import BotonPrimario from '@/Components/Botones/BotonPrimario';

export default function Edit({ coleccion }) {
    const { errors } = usePage().props;

    const { data, setData, put, processing } = useForm({
        nombre: coleccion.nombre,
        descripcion: coleccion.descripcion,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('colecciones.update', coleccion.id));
    };

    return (
        <>
            <Head title="Editar Colección" />
            <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#1cc2b5] px-6 py-4 flex items-center gap-3">
                    <TicketCheck className="w-6 h-6 text-white" />
                    <h1 className="text-xl font-semibold text-white">Editar Colección</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre de la Colección
                        </label>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1cc2b5]"
                            required
                        />
                        {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Descripción
                        </label>
                        <textarea
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className="w-full px-4 py-2 border border-[#1cc2b5] rounded-md bg-white text-gray-800 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-[#1cc2b5]"
                            required
                        />
                        {errors.descripcion && <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>}
                    </div>

                    <div className="flex justify-center">
                        <BotonPrimario type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </BotonPrimario>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => <MainLayout>{page}</MainLayout>;
