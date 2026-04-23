<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
    // Middleware removido - será aplicado nas rotas

    public function dashboard()
    {
        $stats = [
            'total_hotels' => Hotel::count(),
            'active_hotels' => Hotel::where('status', 'active')->count(),
            'trial_hotels' => Hotel::whereNotNull('trial_ends_at')
                ->where('trial_ends_at', '>', now())
                ->count(),
            'total_users' => User::count(),
            'total_reservations' => Reservation::count(),
            'total_revenue' => DB::table('reservations')->sum('total_price'),
            'new_hotels_this_month' => Hotel::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        $recentHotels = Hotel::withCount('users')
            ->latest()
            ->take(5)
            ->get();

        $topPerformingHotels = Hotel::query()
            ->withCount('users')
            ->addSelect([
                'reservations_count' => Reservation::query()
                    ->whereColumn('reservations.hotel_id', 'hotels.id')
                    ->selectRaw('COUNT(*)'),
                'reservations_sum_total_price' => Reservation::query()
                    ->whereColumn('reservations.hotel_id', 'hotels.id')
                    ->selectRaw('COALESCE(SUM(reservations.total_price), 0)'),
            ])
            ->orderBy('reservations_count', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('SuperAdmin/Dashboard', [
            'stats' => $stats,
            'recentHotels' => $recentHotels,
            'topPerformingHotels' => $topPerformingHotels,
        ]);
    }

    public function hotels()
    {
        $hotels = Hotel::withCount('users')->get();
        
        $stats = [
            'total_hotels' => Hotel::count(),
            'active_hotels' => Hotel::where('status', 'active')->count(),
            'trial_hotels' => Hotel::where('status', 'trial')->count(),
            'new_hotels_this_month' => Hotel::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        return Inertia::render('SuperAdmin/Hotels/Index', [
            'hotels' => $hotels,
            'stats' => $stats
        ]);
    }

    public function createHotel()
    {
        return Inertia::render('SuperAdmin/Hotels/Create');
    }

    public function storeHotel(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|max:50|unique:hotels,subdomain',
            'description' => 'nullable|string',
            'primary_color' => 'nullable|string',
            'secondary_color' => 'nullable|string',
            'admin_name' => 'required|string|max:255',
            'admin_email' => 'required|email|max:255|unique:users,email',
            'admin_password' => 'required|string|min:8',
        ]);

        DB::beginTransaction();
        try {
            // Criar o hotel
            $hotel = Hotel::create([
                'name' => $validated['name'],
                'subdomain' => $validated['subdomain'],
                'slug' => str()->slug($validated['name']),
                'description' => $validated['description'],
                'primary_color' => $validated['primary_color'] ?? '#0088cc',
                'secondary_color' => $validated['secondary_color'] ?? '#6c757d',
                'status' => 'active',
                'trial_ends_at' => now()->addDays(30), // 30 dias de trial
                'subscription_limits' => [
                    'max_rooms' => 50,
                    'max_users' => 10,
                    'max_reservations_per_month' => 1000,
                ],
            ]);

            // Criar o usuário admin do hotel
            $admin = User::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($validated['admin_password']),
                'hotel_id' => $hotel->id,
                'role' => 'hotel_admin',
                'is_active' => true,
            ]);

            DB::commit();

            return redirect()->route('superadmin.hotels')
                ->with('success', 'Hotel e administrador criados com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erro ao criar hotel: ' . $e->getMessage());
        }
    }

    public function editHotel(Hotel $hotel)
    {
        $hotel->load(['users' => function ($query) {
            $query->orderBy('role');
        }]);

        return Inertia::render('SuperAdmin/Hotels/Edit', [
            'hotel' => $hotel,
        ]);
    }

    public function updateHotel(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|max:50|unique:hotels,subdomain,' . $hotel->id,
            'description' => 'nullable|string',
            'primary_color' => 'nullable|string',
            'secondary_color' => 'nullable|string',
            'status' => 'required|in:active,inactive,suspended',
            'subscription_limits.max_rooms' => 'required|integer|min:1',
            'subscription_limits.max_users' => 'required|integer|min:1',
            'subscription_limits.max_reservations_per_month' => 'required|integer|min:1',
        ]);

        $hotel->update($validated);

        return redirect()->route('superadmin.hotels')
            ->with('success', 'Hotel atualizado com sucesso!');
    }

    public function users()
    {
        $users = User::with('hotel')->get();
        
        $stats = [
            'total_users' => User::count(),
            'super_admin_count' => User::where('role', 'super_admin')->count(),
            'hotel_admin_count' => User::where('role', 'hotel_admin')->count(),
            'receptionist_count' => User::where('role', 'receptionist')->count(),
        ];

        return Inertia::render('SuperAdmin/Users/Index', [
            'users' => $users,
            'stats' => $stats
        ]);
    }

    public function createUser()
    {
        $hotels = Hotel::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('SuperAdmin/Users/Create', [
            'hotels' => $hotels,
        ]);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:super_admin,hotel_admin,receptionist',
            'hotel_id' => 'nullable|exists:hotels,id',
        ]);

        if ($validated['role'] === 'super_admin') {
            $validated['hotel_id'] = null;
        } else {
            $request->validate([
                'hotel_id' => 'required|exists:hotels,id',
            ]);
        }

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'hotel_id' => $validated['hotel_id'],
            'is_active' => true,
        ]);

        return redirect()->route('superadmin.users')
            ->with('success', 'Usuário criado com sucesso!');
    }

    public function editUser(User $user)
    {
        $hotels = Hotel::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('SuperAdmin/Users/Edit', [
            'user' => $user->load('hotel'),
            'hotels' => $hotels,
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:super_admin,hotel_admin,receptionist',
            'hotel_id' => 'nullable|exists:hotels,id',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validated['role'] === 'super_admin') {
            $validated['hotel_id'] = null;
        } else {
            $request->validate([
                'hotel_id' => 'required|exists:hotels,id',
            ]);
        }

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'hotel_id' => $validated['hotel_id'],
        ];

        if (!empty($validated['password'])) {
            $payload['password'] = Hash::make($validated['password']);
        }

        $user->update($payload);

        return redirect()->route('superadmin.users')
            ->with('success', 'Usuário atualizado com sucesso!');
    }

    public function toggleUserStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);

        return back()->with('success', 'Status do usuário atualizado com sucesso!');
    }

    public function analytics()
    {
        $analytics = [
            'total_revenue' => DB::table('reservations')->sum('total_price') ?: 0,
            'active_hotels' => Hotel::where('status', 'active')->count(),
            'active_users' => User::where('is_active', true)->count(),
            'monthly_reservations' => Reservation::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'revenue_growth' => '15.2',
            'hotels_growth' => '8.7',
            'users_growth' => '12.3',
            'reservations_growth' => '6.5',
            'top_hotels' => Hotel::withCount('users')
                ->withSum('reservations', 'total_price')
                ->orderBy('reservations_sum_total_price', 'desc')
                ->take(5)
                ->get(),
            'recent_activity' => [
                [
                    'type' => 'hotel_created',
                    'description' => 'Novo hotel "Hotel Paradise" cadastrado',
                    'time' => 'Há 2 horas'
                ],
                [
                    'type' => 'user_registered',
                    'description' => 'Novo usuário registrado em "Hotel Central"',
                    'time' => 'Há 4 horas'
                ],
                [
                    'type' => 'reservation_made',
                    'description' => 'Reserva #1234 confirmada',
                    'time' => 'Há 6 horas'
                ]
            ]
        ];

        return Inertia::render('SuperAdmin/Analytics', [
            'analytics' => $analytics,
            'period' => '30d'
        ]);
    }

    
    public function toggleHotelStatus(Hotel $hotel)
    {
        $newStatus = $hotel->status === 'active' ? 'inactive' : 'active';
        $hotel->update(['status' => $newStatus]);

        return back()->with('success', "Hotel {$newStatus} com sucesso!");
    }

    public function extendTrial(Hotel $hotel)
    {
        $hotel->update([
            'trial_ends_at' => now()->addDays(30),
            'status' => 'trial'
        ]);

        return back()->with('success', 'Trial estendido por 30 dias!');
    }

    public function settings()
    {
        // Configurações do SaaS
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
            'active_hotels' => Hotel::where('status', 'active')->count(),
            'total_users' => User::count(),
            'monthly_revenue' => DB::table('reservations')->sum('total_price') ?: 0,
            'storage_used' => '2.4GB', // TODO: Calcular storage real
        ];

        return Inertia::render('SuperAdmin/Settings', [
            'settings' => $settings,
            'stats' => $stats
        ]);
    }

    public function updateSettings(Request $request)
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
}
