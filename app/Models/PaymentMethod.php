<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    // Métodos de pagamento são globais (slug é unique), então não devem ser filtrados por hotel_id
    protected $fillable = ['name', 'slug', 'active'];
}
