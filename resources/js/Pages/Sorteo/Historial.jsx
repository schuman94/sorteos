import MainLayout from '@/Layouts/MainLayout';
import HistorialSorteos from '@/Components/Sorteo/HistorialSorteos';

export default function Historial(props) {
    return (
        <HistorialSorteos
            titulo="Historial"
            onFilterRoute="sorteo.historial"
            {...props}
        />
    );
}

Historial.layout = (page) => <MainLayout>{page}</MainLayout>;
