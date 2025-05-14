// Convierte un string JSON en el formato adecuado para las opciones de Wheel
export function jsonToWheel(jsonString) {
    try {
        return JSON.parse(jsonString).map(op => ({ option: op }));
    } catch (e) {
        console.error('Error al convertir JSON a formato Wheel:', e);
        return [];
    }
}

// Convierte un string JSON en una cadena de opciones separadas por salto de linea para el textarea
export function jsonToText(jsonString) {
    try {
        return JSON.parse(jsonString).join('\n');
    } catch (e) {
        console.error('Error al convertir JSON a texto:', e);
        return '';
    }
}
