<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Request;

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
        // Enforce HTTPS in production environment to secure data transmission
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Rate limit API requests set to 2 per second and 40 per minute
        RateLimiter::for('api', function (object $job) {
            return [
                Limit::perSecond(2),
                Limit::perMinute(40),
            ];
        });

        // Define a rate limiter for login attempts
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });
    }
}