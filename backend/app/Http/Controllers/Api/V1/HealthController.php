<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Throwable;

/**
 * GET /api/v1/health — 200 only when the database and the cache respond (JM-27).
 * Used by the frontend skeleton smoke test and by monitoring.
 */
class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $database = $this->databaseResponds();
        $cache = $this->cacheResponds();

        $healthy = $database && $cache;

        return response()->json([
            'status' => $healthy ? 'ok' : 'unhealthy',
            'database' => $database,
            'cache' => $cache,
            'checked_at' => now()->toIso8601String(),
        ], $healthy ? 200 : 503);
    }

    private function databaseResponds(): bool
    {
        try {
            DB::select('SELECT 1');

            return true;
        } catch (Throwable) {
            return false;
        }
    }

    private function cacheResponds(): bool
    {
        try {
            Cache::store()->put('health:check', true, 10);

            return Cache::store()->get('health:check') === true;
        } catch (Throwable) {
            return false;
        }
    }
}
