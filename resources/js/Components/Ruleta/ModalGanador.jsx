import BotonPrimario from '@/Components/Botones/BotonPrimario';

export default function ModalGanador({ visible, ganador, onClose }) {
    if (!visible || !ganador) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center">
                <p className="text-sm uppercase text-gray-500 tracking-widest mb-2">Opción ganadora</p>
                <h2 className="text-3xl font-extrabold mb-6 break-words" style={{ color: '#2e2b4a' }}>
                    {ganador}
                </h2>
                <BotonPrimario onClick={onClose}>Aceptar</BotonPrimario>
            </div>
        </div>
    );
}
