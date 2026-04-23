<?php

namespace App\Models;

use App\Models\Concerns\BelongsToHotel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Channel extends Model
{
    use HasFactory, BelongsToHotel;

    protected $fillable = [
        'hotel_id',
        'name',
        'code',
        'is_active',
        'credentials',
        'settings',
        'last_sync_at',
        'sync_error',
    ];

    protected $casts = [
        'credentials' => 'array',
        'settings' => 'array',
        'is_active' => 'boolean',
        'last_sync_at' => 'datetime',
    ];

    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    public function syncReservations()
    {
        $syncClass = 'App\\Services\\Channels\\' . ucfirst($this->code) . 'Channel';
        
        if (class_exists($syncClass)) {
            $syncService = new $syncClass($this);
            return $syncService->syncReservations();
        }

        throw new \Exception("Channel integration not found for: {$this->code}");
    }

    public function updateAvailability($roomId, $available)
    {
        $syncClass = 'App\\Services\\Channels\\' . ucfirst($this->code) . 'Channel';
        
        if (class_exists($syncClass)) {
            $syncService = new $syncClass($this);
            return $syncService->updateAvailability($roomId, $available);
        }

        return false;
    }

    public function updatePricing($roomId, $price)
    {
        $syncClass = 'App\\Services\\Channels\\' . ucfirst($this->code) . 'Channel';
        
        if (class_exists($syncClass)) {
            $syncService = new $syncClass($this);
            return $syncService->updatePricing($roomId, $price);
        }

        return false;
    }
}
