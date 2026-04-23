<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use BelongsToHotel;

    protected $fillable = [
        'hotel_id', 'hotel_name', 'logo_path', 'cnpj', 'email', 'phone', // Adicione logo_path
        'address', 'check_in_time', 'check_out_time'
    ];
}
