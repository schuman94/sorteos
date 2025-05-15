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

export function formatearFechaCorta(fechaUtc) {
    if (!fechaUtc) return 'Fecha no disponible';

    try {
        return new Date(fechaUtc).toLocaleDateString('es-ES', {
            timeZone: 'Europe/Madrid',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch {
        return 'Fecha inválida';
    }
}
