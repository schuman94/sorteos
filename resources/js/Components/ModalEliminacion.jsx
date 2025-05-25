import BotonGris from '@/Components/Botones/BotonGris';
import BotonRojo from '@/Components/Botones/BotonRojo';

export default function ModalEliminacion({ visible, titulo = '¿Estás seguro?', mensaje, onConfirmar, onCancelar }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-4">{titulo}</h2>
                {mensaje && <p className="mb-6 text-gray-700">{mensaje}</p>}
                <div className="flex justify-end gap-2">
                    <BotonGris onClick={onCancelar}>
                        Cancelar
                    </BotonGris>
                    <BotonRojo onClick={onConfirmar}>
                        Confirmar
                    </BotonRojo>
                </div>
            </div>
        </div>
    );
}
