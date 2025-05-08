import React from 'react';
import MainLayout from '@/Layouts/MainLayout';

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
                    <p>{new Date(coleccion.created_at).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}

Show.layout = (page) => <MainLayout>{page}</MainLayout>;
