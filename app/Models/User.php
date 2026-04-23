<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'hotel_id',
        'role',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function isSuperAdmin()
    {
        return $this->role === 'super_admin';
    }

    public function isHotelAdmin()
    {
        return $this->role === 'hotel_admin';
    }

    public function isReceptionist()
    {
        return $this->role === 'receptionist';
    }

    // Mantido para compatibilidade
    public function isAdmin()
    {
        return $this->role === 'admin' || $this->role === 'hotel_admin' || $this->role === 'super_admin';
    }

    public function canManageHotel($hotel)
    {
        if ($this->isSuperAdmin()) {
            return true;
        }
        
        return $this->hotel_id === $hotel->id && ($this->isHotelAdmin() || $this->isReceptionist());
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByHotel($query, $hotelId)
    {
        return $query->where('hotel_id', $hotelId);
    }
}
