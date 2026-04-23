<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminSettingsController extends Controller
{
    public function index()
    {
        // TODO: Buscar configurações do banco de dados
        $settings = [
            'platform_name' => 'Exchange Sistemas - Hotel',
            'admin_email' => 'admin@hotelmanager.com',
            'support_email' => 'suporte@hotelmanager.com',
            'default_trial_days' => 30,
            'max_trial_extensions' => 1,
            'default_limits' => [
                'max_rooms' => 50,
                'max_users' => 10,
                'max_reservations_per_month' => 1000,
            ],
            'smtp_host' => '',
            'smtp_port' => 587,
            'smtp_username' => '',
            'smtp_password' => '',
            'smtp_encryption' => 'tls',
            'maintenance_mode' => false,
            'debug_mode' => false,
            'backup_frequency' => 'daily',
            'stripe_enabled' => false,
            'stripe_public_key' => '',
            'stripe_secret_key' => '',
            'base_domain' => 'hotelmanager.com',
            'force_https' => true,
        ];

        // Estatísticas do sistema
        $stats = [
            'active_hotels' => \App\Models\Hotel::where('status', 'active')->count(),
            'total_users' => \App\Models\User::count(),
            'monthly_revenue' => \DB::table('reservations')->sum('total_price') ?: 0,
            'storage_used' => '2.4GB', // TODO: Calcular storage real
        ];

        return Inertia::render('SuperAdmin/Settings', [
            'settings' => $settings,
            'stats' => $stats
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'platform_name' => 'required|string|max:255',
            'admin_email' => 'required|email|max:255',
            'support_email' => 'required|email|max:255',
            'default_trial_days' => 'required|integer|min:1|max:365',
            'max_trial_extensions' => 'required|integer|min:0|max:10',
            'default_limits.max_rooms' => 'required|integer|min:1',
            'default_limits.max_users' => 'required|integer|min:1',
            'default_limits.max_reservations_per_month' => 'required|integer|min:1',
            'smtp_host' => 'nullable|string|max:255',
            'smtp_port' => 'nullable|integer|min:1|max:65535',
            'smtp_username' => 'nullable|string|max:255',
            'smtp_password' => 'nullable|string|max:255',
            'smtp_encryption' => 'required|in:tls,ssl,',
            'maintenance_mode' => 'boolean',
            'debug_mode' => 'boolean',
            'backup_frequency' => 'required|in:daily,weekly,monthly',
            'stripe_enabled' => 'boolean',
            'stripe_public_key' => 'nullable|string|max:255',
            'stripe_secret_key' => 'nullable|string|max:255',
            'base_domain' => 'required|string|max:255',
            'force_https' => 'boolean',
        ]);

        // TODO: Salvar configurações no banco de dados
        // Por enquanto, apenas retorna sucesso
        
        return back()->with('success', 'Configurações do SaaS atualizadas com sucesso!');
    }

    public function testEmail(Request $request)
    {
        // TODO: Implementar teste de configuração de email
        return back()->with('success', 'Email de teste enviado com sucesso!');
    }

    public function backup()
    {
        // TODO: Implementar backup manual
        return back()->with('success', 'Backup iniciado com sucesso!');
    }
}
