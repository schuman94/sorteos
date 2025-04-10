<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dominio extends Model
{
    /** @use HasFactory<\Database\Factories\DominioFactory> */
    use HasFactory;

    public function host() {
        return $this->belongsTo(Host::class);
    }
}
