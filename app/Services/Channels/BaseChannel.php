<?php

namespace App\Services\Channels;

use App\Models\Channel;
use App\Models\Room;
use App\Models\Reservation;
use Carbon\Carbon;

abstract class BaseChannel
{
    protected Channel $channel;
    protected array $credentials;
    protected array $settings;

    public function __construct(Channel $channel)
    {
        $this->channel = $channel;
        $this->credentials = $channel->credentials;
        $this->settings = $channel->settings;
    }

    abstract public function syncReservations(): array;
    abstract public function updateAvailability(int $roomId, bool $available): bool;
    abstract public function updatePricing(int $roomId, float $price): bool;
    abstract public function testConnection(): bool;

    protected function createReservationFromOTA(array $otaReservation): Reservation
    {
        return Reservation::create([
            'hotel_id' => $this->channel->hotel_id,
            'room_id' => $this->findOrCreateRoom($otaReservation),
            'guest_name' => $otaReservation['guest_name'] ?? 'Guest',
            'guest_email' => $otaReservation['guest_email'] ?? null,
            'guest_phone' => $otaReservation['guest_phone'] ?? null,
            'check_in' => Carbon::parse($otaReservation['check_in']),
            'check_out' => Carbon::parse($otaReservation['check_out']),
            'total_price' => $otaReservation['total_price'] ?? 0,
            'status' => $this->mapStatus($otaReservation['status'] ?? 'confirmed'),
            'channel' => $this->channel->code,
            'channel_reservation_id' => $otaReservation['id'] ?? null,
            'notes' => $otaReservation['notes'] ?? null,
        ]);
    }

    protected function findOrCreateRoom(array $otaReservation): int
    {
        // Tenta encontrar o quarto pelo nome ou código do OTA
        $room = Room::where('hotel_id', $this->channel->hotel_id)
            ->where(function ($query) use ($otaReservation) {
                $query->where('name', $otaReservation['room_name'] ?? '')
                      ->orWhere('ota_code', $otaReservation['room_code'] ?? '');
            })
            ->first();

        if (!$room) {
            // Cria um novo quarto se não encontrar
            $room = Room::create([
                'hotel_id' => $this->channel->hotel_id,
                'name' => $otaReservation['room_name'] ?? 'Room from OTA',
                'ota_code' => $otaReservation['room_code'] ?? null,
                'capacity' => $otaReservation['capacity'] ?? 2,
                'price_per_night' => $otaReservation['price_per_night'] ?? 100,
                'type' => $otaReservation['room_type'] ?? 'standard',
            ]);
        }

        return $room->id;
    }

    protected function mapStatus(string $otaStatus): string
    {
        $statusMap = [
            'confirmed' => 'confirmed',
            'pending' => 'pending',
            'cancelled' => 'cancelled',
            'completed' => 'checked_out',
        ];

        return $statusMap[$otaStatus] ?? 'pending';
    }

    protected function updateSyncStatus(bool $success, string $error = null): void
    {
        $this->channel->update([
            'last_sync_at' => now(),
            'sync_error' => $success ? null : $error,
        ]);
    }
}
