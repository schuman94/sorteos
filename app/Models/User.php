<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function is_admin()
    {
        return $this->role === 'admin';
    }

    public function sorteos()
    {
        return $this->hasMany(Sorteo::class);
    }

    // Por ahora no se usa
    public function sorteosConEliminados()
    {
        return $this->hasMany(Sorteo::class)->withTrashed();
    }

    public function ruletas()
    {
        return $this->hasMany(Ruleta::class);
    }

    public function colecciones()
    {
        return $this->hasMany(Coleccion::class);
    }

    public function rascas()
    {
        return $this->hasMany(Rasca::class, 'scratched_by');
    }

    public function premios()
    {
        return $this->hasMany(Premio::class);
    }
}
