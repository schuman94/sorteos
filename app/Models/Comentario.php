<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    /** @use HasFactory<\Database\Factories\ComentarioFactory> */
    use HasFactory;

    protected $fillable = ['autor', 'texto', 'fecha_hora'];

    public function ganador() {
        return $this->belongsTo(Ganador::class);
    }

    public function sorteo() {
        return $this->belongsTo(Sorteo::class);
    }
}
