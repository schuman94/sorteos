<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruleta extends Model
{
    /** @use HasFactory<\Database\Factories\RuletaFactory> */
    use HasFactory;

    protected $fillable = ['nombre', 'entradas'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
