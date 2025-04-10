<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Host extends Model
{
    /** @use HasFactory<\Database\Factories\HostFactory> */
    use HasFactory;

    public function dominios() {
        return $this->hasMany(Dominio::class);
    }

    public function publicaciones()
    {
        return $this->hasMany(Publicacion::class);
    }
}
