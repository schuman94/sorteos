<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ganadores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sorteo_id')->constrained();
            $table->string('nombre_manual')->nullable();
            $table->boolean('esSuplente');
            $table->integer('posicion');
            $table->timestamps();
            $table->unique(['sorteo_id', 'posicion', 'esSuplente']); // No puede haber dos ganadores en la misma posicion para un sorteo
            $table->unique(['sorteo_id', 'nombre_manual']); // Un participante manual no puede aparecer ganador dos veces en el mismo sorteo. Postgres permite coexistir nulos
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ganadores');
    }
};
