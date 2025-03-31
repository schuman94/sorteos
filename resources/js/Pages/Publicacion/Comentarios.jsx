import React from 'react';
import Show from './Show';
import { Head } from '@inertiajs/react';

export default function Comentarios(props) {
    return (
        <>
            <Head title="Comentarios" />
            <div className="min-h-screen bg-gray-50 dark:bg-black text-black/70 dark:text-white/70 py-16 px-4">
                <h1 className="text-3xl font-semibold text-center mb-8">Comentarios del video</h1>

                <div className="flex justify-center">
                    <Show {...props} />
                </div>
            </div>
        </>
    );
}
