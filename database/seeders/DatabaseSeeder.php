<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Hotel;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Criar Super Admin
        User::firstOrCreate(
            ['email' => 'admin@hotelmanager.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Criar Hotel de Exemplo
        $hotel = Hotel::firstOrCreate(
            ['subdomain' => 'demo'],
            [
                'name' => 'Hotel Exemplo',
                'slug' => 'hotel-exemplo',
                'description' => 'Hotel de demonstração do sistema',
                'primary_color' => '#0088cc',
                'secondary_color' => '#6c757d',
                'status' => 'active',
                'trial_ends_at' => now()->addDays(30),
                'subscription_limits' => [
                    'max_rooms' => 50,
                    'max_users' => 10,
                    'max_reservations_per_month' => 1000,
                ],
            ]
        );

        // Criar Admin do Hotel
        User::firstOrCreate(
            ['email' => 'admin@demo.hotelmanager.com'],
            [
                'name' => 'Admin Hotel',
                'password' => Hash::make('admin123'),
                'hotel_id' => $hotel->id,
                'role' => 'hotel_admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Criar Recepcionista
        User::firstOrCreate(
            ['email' => 'recepcao@demo.hotelmanager.com'],
            [
                'name' => 'Recepcionista',
                'password' => Hash::make('recepcao123'),
                'hotel_id' => $hotel->id,
                'role' => 'receptionist',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
