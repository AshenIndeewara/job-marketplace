<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * Model policies are auto-discovered from app/Policies by the framework.
     * Add any policy overrides or Gate definitions here as they are introduced.
     */
    public function boot(): void
    {
        //
    }
}
