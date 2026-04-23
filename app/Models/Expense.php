<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use BelongsToHotel;

    protected $fillable = ['hotel_id', 'description', 'amount', 'category', 'due_date', 'paid_at'];

    protected $casts = [
        'due_date' => 'date',
        'paid_at' => 'date',
    ];
}
