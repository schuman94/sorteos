import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function Show({ rasca }) {
    return (
        <>
            <Head title="Rasca" />

            <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
                <h1 className="text-2xl font-bold text-center">Rasca</h1>

                <div className="bg-white rounded shadow p-6 space-y-4">
                    <div>
                        <strong>Colección:</strong> {rasca.coleccion?.nombre || 'Desconocida'}
                    </div>

                    <div>
                        <strong>¿Rascado?:</strong>{' '}
                        {rasca.scratched_at ? (
                            <span className="text-green-600 font-semibold">Sí</span>
                        ) : (
                            <span className="text-gray-600">No</span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = page => <MainLayout>{page}</MainLayout>;
