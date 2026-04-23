<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            if (!Schema::hasColumn('settings', 'hotel_id')) {
                $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
                $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
                $table->unique('hotel_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            if (Schema::hasColumn('settings', 'hotel_id')) {
                $table->dropUnique(['hotel_id']);
                $table->dropForeign(['hotel_id']);
                $table->dropColumn('hotel_id');
            }
        });
    }
};
