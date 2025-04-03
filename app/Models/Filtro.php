<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filtro extends Model
{
    /** @use HasFactory<\Database\Factories\FiltroFactory> */
    use HasFactory;

    protected $fillable = [
        'permitir_comentarios_duplicados',
        'permitir_autores_duplicados',
        'hashtag',
        'mencion',
    ];

    public function sorteo() {
        return $this->belongsTo(Sorteo::class);
    }
}
