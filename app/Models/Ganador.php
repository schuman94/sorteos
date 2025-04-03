<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ganador extends Model
{
    /** @use HasFactory<\Database\Factories\GanadorFactory> */
    use HasFactory;

    protected $table = 'ganadores';

    protected $fillable = ['posicion', 'nombre_manual'];

    public function clasificacion() {
        return $this->belongsTo(Clasificacion::class);
    }

    public function comentario() {
        return $this->hasOne(Comentario::class);
    }
}
