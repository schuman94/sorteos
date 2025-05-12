export default function FiltroHistorial({ anyoSeleccionado, tipoSeleccionado, anyos, hosts, onChange }) {
    return (
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-2xl font-semibold">Historial de Sorteos</h1>

            <div className="flex gap-4">
                <select
                    id="anyo"
                    name="anyo"
                    value={anyoSeleccionado || ''}
                    onChange={onChange}
                    className="rounded border-gray-300 text-sm shadow-sm"
                >
                    {anyos.map((a) => (
                        <option key={a} value={a}>
                            {a}
                        </option>
                    ))}
                </select>

                <select
                    id="tipo"
                    name="tipo"
                    value={tipoSeleccionado || ''}
                    onChange={onChange}
                    className="rounded border-gray-300 text-sm shadow-sm"
                >
                    <option value="">Todos</option>
                    <option value="manual">Manual</option>
                    {hosts.map((host) => (
                        <option key={host.id} value={host.id}>
                            {host.nombre}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
