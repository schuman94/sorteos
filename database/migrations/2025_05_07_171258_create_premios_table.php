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
        Schema::create('premios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('proveedor');
            $table->decimal('valor', 8, 2)->default(0);
            $table->text('descripcion')->nullable();
            $table->string('link')->nullable();
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
            // imagen
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('premios');
    }
};
