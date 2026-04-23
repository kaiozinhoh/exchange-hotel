<?php

namespace App\Http\Middleware;

use App\Models\Hotel;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Se for super admin, não precisa de tenant
        if (auth()->check() && auth()->user()->isSuperAdmin()) {
            return $next($request);
        }

        // Obter o hotel baseado no subdomínio ou domínio
        $hotel = $this->getTenantFromRequest($request);

        if (!$hotel) {
            // Se não encontrar hotel, redirecionar para página de erro ou login
            if ($request->is('login') || $request->is('register')) {
                return $next($request);
            }

            return response()->view('errors.no-hotel', [], 404);
        }

        // Verificar se o hotel está ativo
        if ($hotel->status !== 'active') {
            return response()->view('errors.hotel-inactive', ['hotel' => $hotel], 403);
        }

        // Verificar se a assinatura está válida
        if (!$hotel->isSubscriptionActive() && !$hotel->isOnTrial()) {
            return response()->view('errors.subscription-expired', ['hotel' => $hotel], 403);
        }

        // Adicionar o hotel ao request para uso nos controllers
        $request->merge(['current_hotel' => $hotel]);

        // Configurar o tenant no contexto da aplicação
        $this->setTenantContext($hotel);

        return $next($request);
    }

    protected function getTenantFromRequest(Request $request): ?Hotel
    {
        $host = $request->getHost();
        
        // Se for subdomínio
        $subdomain = explode('.', $host)[0];
        
        // Ignorar subdomínios comuns (www, app, api, etc.)
        if (in_array($subdomain, ['www', 'app', 'api', 'localhost', '127'])) {
            return null;
        }

        // Buscar hotel pelo subdomínio
        $hotel = Hotel::where('subdomain', $subdomain)->active()->first();

        // Se não encontrar por subdomínio, tentar por domínio customizado
        if (!$hotel) {
            $hotel = Hotel::where('domain', $host)->active()->first();
        }

        return $hotel;
    }

    protected function setTenantContext(Hotel $hotel): void
    {
        // Adicionar hotel ao contexto global
        app()->singleton('current_hotel', fn() => $hotel);

        // Configurar database connection para o tenant se necessário
        // (Para implementações mais avançadas com databases separadas)
        
        // Configurar cache prefix para o tenant
        config(['cache.prefix' => 'hotel_' . $hotel->id]);
        
        // Configurar session prefix para o tenant
        config(['session.cookie' => 'hotel_session_' . $hotel->id]);
    }
}
