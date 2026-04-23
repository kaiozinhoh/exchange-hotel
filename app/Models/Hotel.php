<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hotel extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'subdomain',
        'domain',
        'description',
        'logo_url',
        'favicon_url',
        'primary_color',
        'secondary_color',
        'settings',
        'status',
        'trial_ends_at',
        'subscription_ends_at',
        'subscription_limits',
    ];

    protected $casts = [
        'settings' => 'array',
        'subscription_limits' => 'array',
        'trial_ends_at' => 'datetime',
        'subscription_ends_at' => 'datetime',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function parkingSpaces()
    {
        return $this->hasMany(ParkingSpace::class);
    }

    public function paymentMethods()
    {
        return $this->hasMany(PaymentMethod::class);
    }

    public function getSubscriptionLimitsAttribute($value)
    {
        return $value ? json_decode($value, true) : [
            'max_rooms' => 50,
            'max_users' => 10,
            'max_reservations_per_month' => 1000,
        ];
    }

    public function isOnTrial()
    {
        return $this->trial_ends_at && $this->trial_ends_at->isFuture();
    }

    public function isSubscriptionActive()
    {
        return !$this->subscription_ends_at || $this->subscription_ends_at->isFuture();
    }

    public function canAddRoom()
    {
        $limit = $this->subscription_limits['max_rooms'] ?? 50;
        return $this->rooms()->count() < $limit;
    }

    public function canAddUser()
    {
        $limit = $this->subscription_limits['max_users'] ?? 10;
        return $this->users()->count() < $limit;
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeBySubdomain($query, $subdomain)
    {
        return $query->where('subdomain', $subdomain);
    }
}
