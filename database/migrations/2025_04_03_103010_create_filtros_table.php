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
        Schema::create('filtros', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sorteo_id')->constrained();
            $table->boolean('mencion')->default(false);
            $table->string('hashtag')->nullable(); // Podriamos generalizarlo a filtro texto en el futuro
            $table->boolean('permitir_autores_duplicados')->default(false); // ¿no incluye participantes manuales?
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filtros');
    }
};
