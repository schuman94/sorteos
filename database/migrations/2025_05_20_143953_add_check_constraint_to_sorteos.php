<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            ALTER TABLE sorteos
            ADD CONSTRAINT sorteos_publicacion_or_nombre_not_null
            CHECK (
                publicacion_id IS NOT NULL OR nombre IS NOT NULL
            )
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            ALTER TABLE sorteos
            DROP CONSTRAINT sorteos_publicacion_or_nombre_not_null
        ");
    }
};
