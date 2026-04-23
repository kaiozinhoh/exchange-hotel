<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;
use Illuminate\Support\Facades\Schema;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $settings = null;
        if ($user && $user->role !== 'super_admin') {
            if (Schema::hasColumn('settings', 'hotel_id')) {
                $settings = Setting::where('hotel_id', $user->hotel_id)->first();
            } else {
                // Compatibilidade com bancos ainda não migrados
                $settings = Setting::first();
            }
        }
        $isSuperAdmin = $user && $user->role === 'super_admin';

        $logoUrl = null;
        $hotelName = 'Laravel Hotel';

        if ($user) {
            if ($isSuperAdmin) {
                // Logo global do sistema para o painel superadmin (arquivo em /public)
                $logoUrl = asset('favicon.ico');
                $hotelName = 'Exchange Hotel Manager';
            } else {
                $hotel = $user->hotel;
                $logoUrl = $hotel?->logo_url ?: ($settings && $settings->logo_path ? asset('storage/' . $settings->logo_path) : null);
                $hotelName = $hotel?->name ?? ($settings?->hotel_name ?? 'Gestão de Hotel');
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            // --- ESTA PARTE É ESSENCIAL PARA OS TOASTS ---
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
            ],
            // ---------------------------------------------
            'app_settings' => [
                'hotel_name' => $hotelName,
                'logo_url' => $logoUrl,
            ],
        ];
    }
}
