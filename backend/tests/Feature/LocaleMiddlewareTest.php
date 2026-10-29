<?php

namespace Tests\Feature;

use Tests\TestCase;

class LocaleMiddlewareTest extends TestCase
{
    /** @test */
    public function accept_language_header_sets_the_app_locale(): void
    {
        $this->withHeaders(['Accept-Language' => 'si-LK,si;q=0.9'])
            ->getJson('/api/v1/health');

        $this->assertSame('si', app()->getLocale());
    }

    /** @test */
    public function unsupported_locales_fall_back_to_english(): void
    {
        $this->withHeaders(['Accept-Language' => 'fr-FR,fr;q=0.9'])
            ->getJson('/api/v1/health');

        $this->assertSame('en', app()->getLocale());
    }

    /** @test */
    public function tamil_is_supported(): void
    {
        $this->withHeaders(['Accept-Language' => 'ta'])
            ->getJson('/api/v1/health');

        $this->assertSame('ta', app()->getLocale());
    }
}
