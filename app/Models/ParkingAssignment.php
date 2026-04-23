<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Model;

class ParkingAssignment extends Model
{
    use BelongsToHotel;

    protected $fillable = [
        'hotel_id', 'reservation_id', 'parking_space_id',
        'vehicle_plate', 'vehicle_model',
        'started_at', 'ended_at'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function parkingSpace()
    {
        return $this->belongsTo(ParkingSpace::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
