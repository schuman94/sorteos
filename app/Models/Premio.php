<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Premio extends Model
{
    /** @use HasFactory<\Database\Factories\PremioFactory> */
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion', 'proveedor', 'valor', 'link'];

    public function rascas()
    {
        return $this->hasMany(Rasca::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
