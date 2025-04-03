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
            $table->foreignId('clasificacion_id')->constrained('clasificaciones');
            $table->integer('posicion');
            $table->timestamps();
            $table->unique(['sorteo_id', 'posicion', 'clasificacion_id']);
            $table->unique(['sorteo_id', 'nombre_manual']); // Pueden coexistir nulos
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
