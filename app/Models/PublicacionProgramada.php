<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicacionProgramada extends Model
{
    /** @use HasFactory<\Database\Factories\PublicacionProgramadaFactory> */
    use HasFactory;

    protected $table = 'publicaciones_programadas';

    protected $fillable = [
        'mensaje',
        'fecha_programada',
        'publicado',
        'fallido',
        'error_mensaje',
    ];

    protected $casts = [
        'fecha_programada' => 'datetime',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function host()
    {
        return $this->belongsTo(Host::class);
    }

    public function coleccion()
    {
        return $this->belongsTo(Coleccion::class);
    }
}
