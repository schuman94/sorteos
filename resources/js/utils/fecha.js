export function formatearFecha(fechaUtc) {
    if (!fechaUtc) return 'Fecha no disponible';

    try {
        return new Date(fechaUtc).toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            dateStyle: 'short',
            timeStyle: 'short'
        });
    } catch {
        return 'Fecha inválida';
    }
}
