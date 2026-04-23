<?php

namespace App\Services\Channels;

use App\Models\Reservation;
use Carbon\Carbon;

class AirbnbChannel extends BaseChannel
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
                    $existing = Reservation::where('channel', 'airbnb')
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
                'listing_id' => $room->ota_code,
                'availability' => [
                    'start_date' => now()->format('Y-m-d'),
                    'end_date' => now()->addDays(365)->format('Y-m-d'),
                    'available' => $available,
                ],
            ];

            $response = $this->makeAPIRequest('POST', '/listings/availability', $payload);
            
            return $response['success'] ?? false;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function updatePricing(int $roomId, float $price): bool
    {
        try {
            $room = \App\Models\Room::find($roomId);
            if (!$room) return false;

            $payload = [
                'listing_id' => $room->ota_code,
                'daily_price' => $price,
                'currency' => 'BRL',
                'effective_start' => now()->format('Y-m-d'),
                'effective_end' => now()->addDays(365)->format('Y-m-d'),
            ];

            $response = $this->makeAPIRequest('PUT', '/listings/pricing', $payload);
            
            return $response['success'] ?? false;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function testConnection(): bool
    {
        try {
            $response = $this->makeAPIRequest('GET', '/user/listings');
            return isset($response['listings']);
        } catch (\Exception $e) {
            return false;
        }
    }

    private function fetchBookingsFromAPI(): array
    {
        $response = $this->makeAPIRequest('GET', '/reservations', [
            'status' => 'accepted,confirmed',
            'start_date' => now()->subDays(30)->format('Y-m-d'),
            'end_date' => now()->addDays(365)->format('Y-m-d'),
        ]);

        return $this->transformBookingData($response['reservations'] ?? []);
    }

    private function transformBookingData(array $bookings): array
    {
        return array_map(function ($booking) {
            return [
                'id' => $booking['reservation_code'],
                'guest_name' => $booking['guest']['first_name'] . ' ' . $booking['guest']['last_name'],
                'guest_email' => $booking['guest']['email'] ?? null,
                'guest_phone' => $booking['guest']['phone'] ?? null,
                'room_name' => $booking['listing']['name'],
                'room_code' => $booking['listing']['id'],
                'room_type' => $booking['listing']['property_type'] ?? 'standard',
                'capacity' => $booking['listing']['accommodates'] ?? 2,
                'check_in' => $booking['start_date'],
                'check_out' => $booking['end_date'],
                'total_price' => $booking['total_paid_amount'],
                'price_per_night' => $booking['nightly_price'] ?? 0,
                'status' => $this->mapAirbnbStatus($booking['status']),
                'notes' => $booking['guest_notes'] ?? null,
            ];
        }, $bookings);
    }

    private function mapAirbnbStatus(string $airbnbStatus): string
    {
        $statusMap = [
            'accepted' => 'confirmed',
            'confirmed' => 'confirmed',
            'pending' => 'pending',
            'cancelled' => 'cancelled',
        ];

        return $statusMap[$airbnbStatus] ?? 'pending';
    }

    private function makeAPIRequest(string $method, string $endpoint, array $data = []): array
    {
        $clientId = $this->credentials['client_id'] ?? null;
        $clientSecret = $this->credentials['client_secret'] ?? null;
        $accessToken = $this->credentials['access_token'] ?? null;

        if (!$clientId || !$clientSecret || !$accessToken) {
            throw new \Exception('Missing API credentials for Airbnb');
        }

        $client = new \GuzzleHttp\Client([
            'base_uri' => 'https://api.airbnb.com/',
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-Airbnb-API-Key' => $clientId,
            ],
            'timeout' => 30,
        ]);

        $response = $client->request($method, $endpoint, [
            'json' => $data,
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }
}
