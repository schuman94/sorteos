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
        Schema::create('publicaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('host_id')->constrained();
            $table->string('url');
            $table->string('autor'); // canal/usuario
            $table->timestamp('fecha_publicacion');
            $table->unsignedBigInteger('num_comentarios');
            $table->string('titulo')->nullable(); // título/caption
            $table->unsignedBigInteger('likes')->nullable();
            $table->unsignedBigInteger('visualizaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publicaciones');
    }
};
