<?php

namespace App\Interfaces;

use App\Models\Publicacion;

interface PublicacionDriver
{
    public function cargarDatos(Publicacion $publicacion): void;

    public function cargarComentarios(Publicacion $publicacion): void;
}
