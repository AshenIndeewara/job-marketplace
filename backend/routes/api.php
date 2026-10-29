<?php

use App\Http\Controllers\Api\V1\HealthController;
use Illuminate\Support\Facades\Route;

// All API routes are versioned under /api/v1 (PRS 5, JM-27).
// Business endpoints (auth, jobs, applications) land in their own tickets.
Route::prefix('v1')->group(function (): void {
    Route::get('/health', HealthController::class)->name('health');
});
