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
        Schema::create('publicaciones_programadas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('coleccion_id')->nullable()->constrained('colecciones')->cascadeOnDelete();
            $table->foreignId('host_id')->constrained('hosts');
            $table->text('mensaje');
            $table->timestamp('fecha_programada');
            $table->boolean('publicado')->default(false);
            $table->boolean('fallido')->default(false);
            $table->text('error_mensaje')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publicaciones_programadas');
    }
};
