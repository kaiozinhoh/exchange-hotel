<?php

namespace App\Services\Channels;

use App\Models\Reservation;
use Carbon\Carbon;

class BookingSandboxChannel extends BaseChannel
{
    public function syncReservations(): array
    {
        try {
            // Simula dados de teste do Booking.com
            $bookings = $this->getSandboxBookings();
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
        // Simula atualização de disponibilidade no sandbox
        $room = \App\Models\Room::find($roomId);
        if (!$room) return false;

        // Log da atualização (em produção, faria API call)
        \Log::info("Booking Sandbox: Atualizando disponibilidade do quarto {$roomId} para " . ($available ? 'disponível' : 'indisponível'));
        
        // Simula delay da API
        sleep(1);
        
        return true;
    }

    public function updatePricing(int $roomId, float $price): bool
    {
        // Simula atualização de preços no sandbox
        $room = \App\Models\Room::find($roomId);
        if (!$room) return false;

        // Log da atualização (em produção, faria API call)
        \Log::info("Booking Sandbox: Atualizando preço do quarto {$roomId} para R$ {$price}");
        
        // Simula delay da API
        sleep(1);
        
        return true;
    }

    public function testConnection(): bool
    {
        // Simula teste de conexão com sandbox
        try {
            // Simula delay de rede
            sleep(0.5);
            
            // Sempre retorna true no sandbox
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    private function getSandboxBookings(): array
    {
        // Dados de teste simulados do Booking.com
        return [
            [
                'id' => 'BK_' . time() . '_001',
                'guest_name' => 'João Silva (Sandbox)',
                'guest_email' => 'joao.sandbox@test.com',
                'guest_phone' => '+55 11 99999-9999',
                'room_name' => 'Quarto Deluxe (Sandbox)',
                'room_code' => 'ROOM_DEMO_001',
                'room_type' => 'deluxe',
                'capacity' => 2,
                'check_in' => Carbon::now()->addDays(7)->format('Y-m-d'),
                'check_out' => Carbon::now()->addDays(10)->format('Y-m-d'),
                'total_price' => 450.00,
                'price_per_night' => 150.00,
                'status' => 'confirmed',
                'notes' => 'Reserva de teste do ambiente sandbox Booking.com',
            ],
            [
                'id' => 'BK_' . time() . '_002',
                'guest_name' => 'Maria Santos (Sandbox)',
                'guest_email' => 'maria.sandbox@test.com',
                'guest_phone' => '+55 11 88888-8888',
                'room_name' => 'Suíte Master (Sandbox)',
                'room_code' => 'ROOM_DEMO_002',
                'room_type' => 'suite',
                'capacity' => 3,
                'check_in' => Carbon::now()->addDays(14)->format('Y-m-d'),
                'check_out' => Carbon::now()->addDays(17)->format('Y-m-d'),
                'total_price' => 750.00,
                'price_per_night' => 250.00,
                'status' => 'confirmed',
                'notes' => 'Reserva de teste do ambiente sandbox Booking.com',
            ],
        ];
    }
}
