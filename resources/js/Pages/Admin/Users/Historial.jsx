import MainLayout from '@/Layouts/MainLayout';
import HistorialSorteos from '@/Components/Sorteo/HistorialSorteos';

export default function Historial({ user, ...props }) {
    return (
        <HistorialSorteos
            titulo={`Historial de Sorteos - ${user.name}`}
            onFilterRoute="admin.users.historial"
            userId={user.id}
            {...props}
        />
    );
}

Historial.layout = (page) => <MainLayout>{page}</MainLayout>;
