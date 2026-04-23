<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        
        // Verificar se o usuário tem algum dos roles permitidos
        foreach ($roles as $role) {
            if ($this->userHasRole($user, $role)) {
                return $next($request);
            }
        }

        // Se não tiver permissão, redirecionar com erro
        if ($request->expectsJson()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return redirect()->route('dashboard')->with('error', 'Você não tem permissão para acessar esta página.');
    }

    protected function userHasRole($user, string $role): bool
    {
        switch ($role) {
            case 'super_admin':
                return $user->isSuperAdmin();
            case 'hotel_admin':
                return $user->isHotelAdmin();
            case 'receptionist':
                return $user->isReceptionist();
            case 'admin':
                return $user->isAdmin();
            default:
                return false;
        }
    }
}
