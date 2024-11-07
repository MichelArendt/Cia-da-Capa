<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('routes:log-full', function () {
    // Get and sort routes by URI
    $routes = collect(Route::getRoutes())->sortBy(fn ($route) => $route->uri());

    foreach ($routes as $route) {
        $url = url($route->uri());
        Log::info("Route URL: {$url}");
    }

    $this->info('Sorted route URLs logged in storage/logs/laravel.log');
})->describe('Log full URLs of all routes');