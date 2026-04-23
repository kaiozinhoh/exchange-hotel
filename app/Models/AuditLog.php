<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use BelongsToHotel;

    protected $fillable = ['hotel_id', 'user_id', 'action', 'model_type', 'model_id', 'changes', 'ip_address'];

    protected $casts = [
        'changes' => 'array', // Converte JSON para Array automaticamente
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
