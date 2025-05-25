import { formatearFecha as ff } from '@/utils/fecha';
import { ThumbsUp } from 'lucide-react';

export default function Comentario({ autor, fecha, texto, likes }) {
    return (
        <li className="border-b pb-4">
            <p className="font-semibold">{autor}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {ff(fecha)}
            </p>
            <p className="mt-1">{texto}</p>
            {likes != null && (
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4 text-[#1cc2b5]" />
                    {likes}
                </div>
            )}
        </li>
    );
}
