<?php

namespace App\Services\Channels;

use App\Models\Reservation;
use Carbon\Carbon;

class AirbnbSandboxChannel extends BaseChannel
{
    public function syncReservations(): array
    {
        try {
            // Simula dados de teste do Airbnb
            $bookings = $this->getSandboxBookings();
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
        // Simula atualização de disponibilidade no sandbox
        $room = \App\Models\Room::find($roomId);
        if (!$room) return false;

        // Log da atualização (em produção, faria API call)
        \Log::info("Airbnb Sandbox: Atualizando disponibilidade do quarto {$roomId} para " . ($available ? 'disponível' : 'indisponível'));
        
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
        \Log::info("Airbnb Sandbox: Atualizando preço do quarto {$roomId} para R$ {$price}");
        
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
        // Dados de teste simulados do Airbnb
        return [
            [
                'id' => 'AB_' . time() . '_001',
                'guest_name' => 'Carlos Oliveira (Sandbox)',
                'guest_email' => 'carlos.sandbox@test.com',
                'guest_phone' => '+55 11 77777-7777',
                'room_name' => 'Apartamento Completo (Sandbox)',
                'room_code' => 'LISTING_DEMO_001',
                'room_type' => 'entire_home',
                'capacity' => 4,
                'check_in' => Carbon::now()->addDays(5)->format('Y-m-d'),
                'check_out' => Carbon::now()->addDays(8)->format('Y-m-d'),
                'total_price' => 800.00,
                'price_per_night' => 266.67,
                'status' => 'confirmed',
                'notes' => 'Reserva de teste do ambiente sandbox Airbnb',
            ],
            [
                'id' => 'AB_' . time() . '_002',
                'guest_name' => 'Ana Costa (Sandbox)',
                'guest_email' => 'ana.sandbox@test.com',
                'guest_phone' => '+55 11 66666-6666',
                'room_name' => 'Studio Compacto (Sandbox)',
                'room_code' => 'LISTING_DEMO_002',
                'room_type' => 'studio',
                'capacity' => 2,
                'check_in' => Carbon::now()->addDays(12)->format('Y-m-d'),
                'check_out' => Carbon::now()->addDays(15)->format('Y-m-d'),
                'total_price' => 600.00,
                'price_per_night' => 200.00,
                'status' => 'confirmed',
                'notes' => 'Reserva de teste do ambiente sandbox Airbnb',
            ],
        ];
    }
}
