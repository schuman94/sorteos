<?php

namespace App\Drivers;

use App\Interfaces\PublicacionDriver;
use App\Models\Publicacion;

class InstagramDriver implements PublicacionDriver
{
    public function cargarDatos(Publicacion $publicacion): void
    {
        //
    }

    public function cargarComentarios(Publicacion $publicacion): void
    {
        //
    }
}
