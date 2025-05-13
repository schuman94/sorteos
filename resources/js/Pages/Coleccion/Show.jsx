import MainLayout from '@/Layouts/MainLayout';
import { formatearFecha as ff } from '@/utils/fecha';

export default function Show({ coleccion }) {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-8 text-center">{coleccion.nombre}</h1>

            <div className="space-y-4">
                <div>
                    <strong>Descripción:</strong>
                    <p>{coleccion.descripcion}</p>
                </div>


                <div>
                    <strong>Fecha de creación:</strong>
                    <p>{ff(coleccion.created_at)}</p>
                </div>
            </div>
        </div>
    );
}

Show.layout = (page) => <MainLayout>{page}</MainLayout>;
