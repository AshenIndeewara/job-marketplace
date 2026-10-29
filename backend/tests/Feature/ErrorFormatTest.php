<?php

namespace Tests\Feature;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * Feature tests for the single JSON error format (JM-27):
 * { "error": { "code": "...", "message": "...", "errors": {...} } }
 */
class ErrorFormatTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Route::prefix('api/v1/_test')->group(function (): void {
            Route::get('/auth', fn () => ['ok' => true])->middleware('auth:sanctum');
            Route::get('/forbidden', fn () => abort(403));
            Route::post('/validate', fn (Request $request) => $request->validate(['name' => 'required|string']));
            Route::get('/throttled', fn () => ['ok' => true])->middleware('throttle:1');
            Route::get('/only-get', fn () => ['ok' => true]);
        });
    }

    /** @test */
    public function unauthenticated_requests_get_401(): void
    {
        $this->getJson('/api/v1/_test/auth')
            ->assertStatus(401)
            ->assertJsonPath('error.code', 'unauthenticated');
    }

    /** @test */
    public function forbidden_requests_get_403(): void
    {
        $this->getJson('/api/v1/_test/forbidden')
            ->assertStatus(403)
            ->assertJsonPath('error.code', 'forbidden');
    }

    /** @test */
    public function unknown_routes_get_404(): void
    {
        $this->getJson('/api/v1/does-not-exist')
            ->assertStatus(404)
            ->assertJsonPath('error.code', 'not_found');
    }

    /** @test */
    public function wrong_method_gets_405(): void
    {
        $this->postJson('/api/v1/_test/only-get', [])
            ->assertStatus(405)
            ->assertJsonPath('error.code', 'method_not_allowed');
    }

    /** @test */
    public function validation_failures_get_422_with_field_errors(): void
    {
        $this->postJson('/api/v1/_test/validate', [])
            ->assertStatus(422)
            ->assertJsonPath('error.code', 'validation_error')
            ->assertJsonStructure(['error' => ['code', 'message', 'errors' => ['name']]]);
    }

    /** @test */
    public function rate_limited_requests_get_429(): void
    {
        $this->getJson('/api/v1/_test/throttled')->assertOk();

        $this->getJson('/api/v1/_test/throttled')
            ->assertStatus(429)
            ->assertJsonPath('error.code', 'too_many_requests');
    }

    /** @test */
    public function every_api_response_carries_a_request_id(): void
    {
        $response = $this->getJson('/api/v1/health');

        $this->assertNotEmpty($response->headers->get('X-Request-Id'));
    }
}
