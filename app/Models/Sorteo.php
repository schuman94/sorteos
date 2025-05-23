<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sorteo extends Model
{
    /** @use HasFactory<\Database\Factories\SorteoFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $fillable = ['num_participantes', 'url'];

    public function ganadores() {
        return $this->hasMany(Ganador::class);
    }

    public function filtro() {
        return $this->HasOne(Filtro::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function publicacion() {
        return $this->belongsTo(Publicacion::class);
    }
}
