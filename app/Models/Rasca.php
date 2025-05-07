<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rasca extends Model
{
    /** @use HasFactory<\Database\Factories\RascaFactory> */
    use HasFactory;

    protected $fillable = ['codigo'];

    protected $casts = ['scratched_at'];

    public function coleccion()
    {
        return $this->belongsTo(Coleccion::class);
    }

    public function premio()
    {
        return $this->belongsTo(Premio::class);
    }

    public function scratched_by()
    {
        return $this->belongsTo(User::class, 'scratched_by');
    }

}
