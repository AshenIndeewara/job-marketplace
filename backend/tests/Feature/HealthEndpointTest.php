<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthEndpointTest extends TestCase
{
    /** @test */
    public function health_returns_ok_when_database_and_cache_respond(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertOk()
            ->assertJson([
                'status' => 'ok',
                'database' => true,
                'cache' => true,
            ]);
    }

    /** @test */
    public function health_reports_an_unhealthy_state_when_the_database_is_unreachable(): void
    {
        config(['database.default' => 'mysql_broken']);

        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(503)->assertJson(['status' => 'unhealthy', 'database' => false]);
    }
}
