export default function Show({ autor, num_comentarios, likes, fecha_publicacion, titulo, visualizaciones}) {
    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded bg-white shadow dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl font-semibold mb-4">Publicación</h2>

            {titulo && <p className="mb-2"> {titulo}</p>}
            <p className="mb-2"><strong>Autor:</strong> {autor}</p>
            <p className="mb-2"><strong>Comentarios:</strong> {num_comentarios}</p>
            <p className="mb-2"><strong>Likes:</strong> {likes}</p>
            <p className="mb-2"><strong>Fecha:</strong> {new Date(fecha_publicacion).toLocaleDateString()}</p>
            {visualizaciones !== null && (
                <p className="mb-2"><strong>Visualizaciones:</strong> {visualizaciones}</p>
            )}
        </div>
    );
}
