<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reservation extends Model
{
    use BelongsToHotel;

    protected $fillable = [
        'hotel_id',
        'guest_id',
        'room_id',
        'check_in',
        'check_out',
        'total_price', // Importante: padronizado para _price
        'daily_price_snapshot', // Importante: novo campo
        'status'
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'total_price' => 'decimal:2',
        'daily_price_snapshot' => 'decimal:2',
    ];

    public function hotel(): BelongsTo { return $this->belongsTo(Hotel::class); }
    public function guest(): BelongsTo { return $this->belongsTo(Guest::class); }
    public function room(): BelongsTo { return $this->belongsTo(Room::class); }

    public function payments(): HasMany { return $this->hasMany(Payment::class); }
    public function consumptions(): HasMany { return $this->hasMany(Consumption::class); }
    public function parkingAssignments(): HasMany { return $this->hasMany(ParkingAssignment::class); }

    // Escopo: Reservas de um hotel específico
    public function scopeForHotel($query, $hotelId)
    {
        return $query->where('hotel_id', $hotelId);
    }
}
