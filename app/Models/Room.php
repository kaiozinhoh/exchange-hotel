<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Room extends Model
{
    use HasFactory, BelongsToHotel;

    protected $guarded = ['id'];

    // Garante que o preço venha sempre formatado corretamente
    protected $casts = [
        'price_per_night' => 'decimal:2',
    ];

    // Relacionamento: Um quarto pertence a um hotel
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    // Relacionamento: Um quarto tem várias reservas ao longo do tempo
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    // Escopo: Para usar Room::available()->get();
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    // Escopo: Quartos de um hotel específico
    public function scopeForHotel($query, $hotelId)
    {
        return $query->where('hotel_id', $hotelId);
    }
}
