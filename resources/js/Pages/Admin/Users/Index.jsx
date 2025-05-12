import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ users, filters }) {
    const handleChange = (e) => {
        router.get(route('admin.users.index'), {
            ...filters,
            [e.target.name]: e.target.value,
        }, {
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target;

        const params = {
            orden: filters.orden || '',
        };

        if (form.search.value.trim() !== '') {
            params.search = form.search.value.trim();
        }

        if (form.email.value.trim() !== '') {
            params.email = form.email.value.trim();
        }

        router.get(route('admin.users.index'), params, {
            preserveScroll: true,
            replace: true,
        });
    };


    return (
        <>
            <Head title="Panel de Administración" />

            <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
                <h1 className="text-2xl font-bold">Usuarios registrados</h1>

                <form onSubmit={handleSearch} className="flex gap-4 flex-wrap items-center">
                    <select
                        name="orden"
                        value={filters.orden || ''}
                        onChange={handleChange}
                        className="border-gray-300 rounded px-3 py-1 text-sm shadow-sm w-48"
                    >
                        <option value="">Orden alfabético</option>
                        <option value="sorteos">Nº sorteos</option>
                        <option value="fecha_desc">Más recientes</option>
                        <option value="fecha_asc">Más antiguos</option>
                    </select>

                    <input
                        type="text"
                        name="search"
                        defaultValue={filters.search || ''}
                        placeholder="Buscar por nombre..."
                        className="border-gray-300 rounded px-3 py-1 text-sm shadow-sm"
                    />

                    <input
                        type="text"
                        name="email"
                        defaultValue={filters.email || ''}
                        placeholder="Buscar por correo..."
                        className="border-gray-300 rounded px-3 py-1 text-sm shadow-sm"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                    >
                        Buscar
                    </button>

                </form>



                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow rounded text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left font-semibold text-gray-700">
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Sorteos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b hover:bg-gray-50 cursor-pointer transition"
                                    onClick={() => router.visit(route('admin.users.show', user.id))}
                                >
                                    <td className="p-3 font-medium flex items-center gap-2">
                                        {user.name}
                                        {user.is_admin && (
                                            <span className="bg-yellow-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                                Admin
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.sorteos_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center mt-6">
                    {users.links.length > 1 && users.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => router.visit(link.url)}
                            className={`mx-1 px-3 py-1 rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <MainLayout>{page}</MainLayout>;
