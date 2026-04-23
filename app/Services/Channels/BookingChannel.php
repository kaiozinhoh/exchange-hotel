<?php

namespace App\Services\Channels;

use App\Models\Reservation;
use Carbon\Carbon;

class BookingChannel extends BaseChannel
{
    public function syncReservations(): array
    {
        try {
            $bookings = $this->fetchBookingsFromAPI();
            $synced = [];
            $errors = [];

            foreach ($bookings as $booking) {
                try {
                    // Verifica se a reserva já existe
                    $existing = Reservation::where('channel', 'booking')
                        ->where('channel_reservation_id', $booking['id'])
                        ->first();

                    if (!$existing) {
                        $reservation = $this->createReservationFromOTA($booking);
                        $synced[] = $reservation;
                    }
                } catch (\Exception $e) {
                    $errors[] = "Error syncing booking {$booking['id']}: " . $e->getMessage();
                }
            }

            $this->updateSyncStatus(empty($errors), implode('; ', $errors));
            return ['synced' => $synced, 'errors' => $errors];

        } catch (\Exception $e) {
            $this->updateSyncStatus(false, $e->getMessage());
            throw $e;
        }
    }

    public function updateAvailability(int $roomId, bool $available): bool
    {
        try {
            $room = \App\Models\Room::find($roomId);
            if (!$room) return false;

            $payload = [
                'room_id' => $room->ota_code,
                'available' => $available,
                'from_date' => now()->format('Y-m-d'),
                'to_date' => now()->addDays(365)->format('Y-m-d'),
            ];

            $response = $this->makeAPIRequest('PUT', '/rooms/availability', $payload);
            
            return $response['success'] ?? false;
        } catch (\Exception $e) {
            return false;
        }
    }

   .com API
    public function updatePricing(int $roomId, float $price): bool
    {
        try {
            $room = \App\Models\Room::find($roomId);
            if (!$room) return false;

            $payload = [
                'room_id' => $room->ota_code,
                'price' => $price,
                'from_date' => now()->format('Y-m-d'),
                'to_date' => now()->addDays(365)->format('Y-m-d'),
            ];

            $response = $this->makeAPIRequest('PUT', '/rooms/pricing', $payload);
            
            return $response['success'] ?? false;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function testConnection(): bool
    {
        try {
            $response = $this->makeAPIRequest('GET', '/properties');
            return isset($response['properties']);
        } catch (\Exception $e) {
            return false;
        }
    }

    private function fetchBookingsFromAPI(): array
    {
        $response = $this->makeAPIRequest('GET', '/reservations', [
            'from_date' => now()->subDays(30)->format('Y-m-d'),
            'to_date' => now()->addDays(365)->format('Y-m-d'),
        ]);

        return $this->transformBookingData($response['reservations'] ?? []);
    }

    private function transformBookingData(array $bookings): array
    {
        return array_map(function ($booking) {
            return [
                'id' => $booking['reservation_id'],
                'guest_name' => $booking['guest']['name'],
                'guest_email' => $booking['guest']['email'] ?? null,
                'guest_phone' => $booking['guest']['phone'] ?? null,
                'room_name' => $booking['room']['name'],
                'room_code' => $booking['room']['id'],
                'room_type' => $booking['room']['type'] ?? 'standard',
                'capacity' => $booking['room']['max_occupancy'] ?? 2,
                'check_in' => $booking['check_in'],
                'check_out' => $booking['check_out'],
                'total_price' => $booking['total_amount'],
                'price_per_night' => $booking['price_per_night'] ?? 0,
                'status' => $booking['status'],
                'notes' => $booking['guest_comments'] ?? null,
            ];
        }, $bookings);
    }

    private function makeAPIRequest(string $method, string $endpoint, array $data = []): array
    {
        $apiKey = $this->credentials['api_key'] ?? null;
        $propertyId = $this->credentials['property_id'] ?? null;

        if (!$apiKey || !$propertyId) {
            throw new \Exception('Missing API credentials for Booking.com');
        }

        $client = new \GuzzleHttp\Client([
            'base_uri' => 'https://distribution-xml.booking.com/2.0/',
            'headers' => [
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ],
            'timeout' => 30,
        ]);

        $response = $client->request($method, $endpoint, [
            'json' => array_merge($data, ['property_id' => $propertyId]),
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }
}
