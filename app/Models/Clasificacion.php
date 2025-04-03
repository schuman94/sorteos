<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clasificacion extends Model
{
    /** @use HasFactory<\Database\Factories\ClasificacionFactory> */
    use HasFactory;

    protected $table = 'clasificaciones';

    public function ganadores() {
        return $this->hasMany(Ganador::class);
    }
}
