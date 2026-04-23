<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Adicionar hotel_id à tabela rooms
        Schema::table('rooms', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela guests
        Schema::table('guests', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela reservations
        Schema::table('reservations', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela products
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela consumptions
        Schema::table('consumptions', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela payments
        Schema::table('payments', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela parking_spaces
        Schema::table('parking_spaces', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela parking_assignments
        Schema::table('parking_assignments', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela payment_methods
        Schema::table('payment_methods', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela expenses
        Schema::table('expenses', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela stock_entries
        Schema::table('stock_entries', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });

        // Adicionar hotel_id à tabela audit_logs
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->unsignedBigInteger('hotel_id')->nullable()->after('id');
            $table->foreign('hotel_id')->references('id')->on('hotels')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        // Remover foreign keys e colunas na ordem inversa
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('stock_entries', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('payment_methods', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('parking_assignments', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('parking_spaces', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('consumptions', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('guests', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });

        Schema::table('rooms', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
        });
    }
};
