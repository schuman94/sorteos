<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ganador extends Model
{
    /** @use HasFactory<\Database\Factories\GanadorFactory> */
    use HasFactory;

    protected $table = 'ganadores';

    protected $fillable = ['posicion', 'nombre_manual', 'esSuplente'];

    public function comentario() {
        return $this->hasOne(Comentario::class);
    }

    public function sorteo() {
        return $this->belongsTo(Sorteo::class);
    }
}
