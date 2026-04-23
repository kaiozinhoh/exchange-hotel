<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('settings', 'hotel_id')) {
            return;
        }

        Schema::table('settings', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
        });

        Schema::table('settings', function (Blueprint $table) {
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
            $table->unique('hotel_id');
        });
    }

    public function down(): void
    {
        if (!Schema::hasColumn('settings', 'hotel_id')) {
            return;
        }

        Schema::table('settings', function (Blueprint $table) {
            // Caso índices/foreign não existam (ambientes divergentes), o rollback pode falhar.
            // Em produção normalmente não usamos down(), mas deixamos o mais correto possível.
            $table->dropUnique(['hotel_id']);
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });
    }
};
