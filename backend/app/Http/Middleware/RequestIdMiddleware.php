<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Echoes a request ID on every API response so support can trace an error
 * from the frontend error message to the backend log line (JM-27).
 */
class RequestIdMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $requestId = $request->header('X-Request-Id') ?? (string) Str::uuid();

        return $next($request)->header('X-Request-Id', $requestId);
    }
}
