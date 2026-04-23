<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Model;

class ParkingSpace extends Model
{
    use BelongsToHotel;

    protected $fillable = ['hotel_id', 'number', 'type', 'status', 'price_per_day'];

    // Escopo para buscar apenas vagas livres facilmente
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function assignments()
    {
        return $this->hasMany(ParkingAssignment::class);
    }
}
