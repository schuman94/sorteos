import React from 'react';

export default function ModalGanador({ visible, ganador, onClose }) {
    if (!visible || !ganador) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center">
                <p className="text-sm uppercase text-gray-500 tracking-widest mb-2">Opción ganadora</p>
                <h2 className="text-3xl font-extrabold text-green-700 mb-6 break-words">{ganador}</h2>
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
}
