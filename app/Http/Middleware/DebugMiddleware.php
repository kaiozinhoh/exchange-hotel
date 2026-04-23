<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class DebugMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Log da requisição
            Log::info('Request Debug', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'user_id' => auth()->id(),
                'user_role' => auth()->user()?->role,
                'headers' => $request->headers->all(),
                'input' => $request->all(),
            ]);

            $response = $next($request);

            // Log da resposta
            Log::info('Response Debug', [
                'status' => $response->getStatusCode(),
                'url' => $request->fullUrl(),
            ]);

            return $response;

        } catch (Throwable $e) {
            // Log detalhado do erro
            Log::error('Request Error Debug', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'user_id' => auth()->id(),
                'user_role' => auth()->user()?->role,
                'error_message' => $e->getMessage(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'error_trace' => $e->getTraceAsString(),
                'request_input' => $request->all(),
            ]);

            throw $e;
        }
    }
}
