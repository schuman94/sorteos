export default function ModalEliminacion({ visible, titulo = '¿Estás seguro?', mensaje, onConfirmar, onCancelar }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">{titulo}</h2>
                {mensaje && <p className="mb-6 text-gray-700">{mensaje}</p>}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancelar}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirmar}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
