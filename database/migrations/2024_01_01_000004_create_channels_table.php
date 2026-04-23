<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Booking.com, Airbnb, Expedia, etc.
            $table->string('code')->unique(); // booking, airbnb, expedia
            $table->boolean('is_active')->default(true);
            $table->json('credentials'); // API keys, tokens, etc.
            $table->json('settings'); // Configurações específicas do canal
            $table->timestamp('last_sync_at')->nullable();
            $table->text('sync_error')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('channels');
    }
};
