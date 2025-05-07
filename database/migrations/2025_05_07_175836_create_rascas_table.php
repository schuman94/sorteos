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
        Schema::create('rascas', function (Blueprint $table) {
            $table->id();
            $table->uuid('codigo')->unique();
            $table->boolean('proporcionado')->default(false);
            $table->foreignId('coleccion_id')->constrained('colecciones');
            $table->foreignId('premio_id')->nullable()->constrained();
            $table->foreignId('scratched_by')->nullable()->constrained('users');
            $table->timestamp('scratched_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rascas');
    }
};
