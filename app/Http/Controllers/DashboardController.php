<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Payment;
use App\Models\Consumption;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        Log::info('DashboardController::index - Início', [
            'user_id' => auth()->id(),
            'user_role' => auth()->user()?->role,
            'request_url' => $request->fullUrl(),
        ]);

        $user = $request->user(); // Pega o usuário logado
        $isAdmin = $user->role === 'admin';

        Log::info('DashboardController::index - User info', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'hotel_id' => $user->hotel_id,
            'is_admin' => $isAdmin,
        ]);

        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        $totalRooms = Room::count();

        $occupiedRooms = Room::whereHas('reservations', function($q) use ($today) {
            $q->whereIn('status', ['confirmed', 'checked_in'])
              ->where('check_in', '<=', $today)
              ->where('check_out', '>', $today);
        })->count();

        $occupancyRate = $totalRooms > 0 ? ($occupiedRooms / $totalRooms) * 100 : 0;

        $revenueMonth = 0;

        if ($isAdmin) {
            $revenueMonth = Payment::where('status', 'paid')
                ->where('paid_at', '>=', $startOfMonth)
                ->sum('amount');
        }

        // $revenueMonth = Payment::where('status', 'paid')
        //     ->where('paid_at', '>=', $startOfMonth)
        //     ->sum('amount');


        $topProducts = Consumption::select('product_id', DB::raw('sum(quantity) as total_qty'))
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->take(5)
            ->with('product')
            ->get();

        $recentReservations = Reservation::with(['guest', 'room'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'occupancyRate' => round($occupancyRate, 1),
                'occupiedRooms' => $occupiedRooms,
                'totalRooms' => $totalRooms,
                'revenueMonth' => $revenueMonth, // Agora é baseado em pagamentos reais
                'checkinsToday' => Reservation::whereDate('check_in', $today)
                    ->where('status', '!=', 'cancelled')
                    ->count(),
            ],
            'topProducts' => $topProducts,
            'recentReservations' => $recentReservations
        ]);
    }
}
