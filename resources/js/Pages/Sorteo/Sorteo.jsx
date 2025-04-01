import React from 'react';
import Data from '../Publicacion/Data';
import Comentarios from '../Publicacion/Comentarios';
import { Head } from '@inertiajs/react';

export default function Sorteo(props) {
    return (
        <>
            <Head title="Sorteo" />

            <div className="min-h-screen bg-gray-50 dark:bg-black text-black/70 dark:text-white/70 py-16 px-4">
                {/* Información general del video */}
                <div className="flex justify-center mb-12">
                    <Data {...props} />
                </div>

                {/* Lista de comentarios */}
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
                    <Comentarios />
                </div>
            </div>
        </>
    );
}
