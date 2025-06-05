<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coleccion extends Model
{
    /** @use HasFactory<\Database\Factories\ColeccionFactory> */
    use HasFactory;

    protected $table = 'colecciones';
    protected $fillable = ['nombre', 'descripcion'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function estaAbierta() {
        return $this->abierta;
    }

    public function rascas()
    {
        return $this->hasMany(Rasca::class);
    }

    public function publicacionesProgramadas()
    {
        return $this->hasMany(PublicacionProgramada::class);
    }
}
