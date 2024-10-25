<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;

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
     */
    public function boot(): void
    {
        // Rate limit Shopify API requests set to 2 per second and 40 per minute
        RateLimiter::for('api', function (object $job) {
            return [
                Limit::perSecond(2),
                Limit::perMinute(40),
            ];
        });
    }
}