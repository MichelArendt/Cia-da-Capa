<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('routes:log-full', function () {
    $routes = Route::getRoutes();
    foreach ($routes as $route) {
        $url = url($route->uri());
        Log::info("Route URL: {$url}");
    }
    $this->info('Route URLs logged in storage/logs/laravel.log');
})->describe('Log full URLs of all routes');