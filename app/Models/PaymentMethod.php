<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use BelongsToHotel;

    protected $fillable = ['hotel_id', 'name', 'slug', 'active'];
}
