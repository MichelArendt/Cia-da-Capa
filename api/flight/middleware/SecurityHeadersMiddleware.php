<?php
namespace app\middleware;

use Flight;

class SecurityHeadersMiddleware
{
    public function before(array $params): void
    {
        Flight::response()->header('X-Frame-Options', 'SAMEORIGIN');
        Flight::response()->header("Content-Security-Policy", "default-src 'self'");
        Flight::response()->header('X-XSS-Protection', '1; mode=block');
        Flight::response()->header('X-Content-Type-Options', 'nosniff');
        Flight::response()->header('Referrer-Policy', 'no-referrer-when-downgrade');
        Flight::response()->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        Flight::response()->header('Permissions-Policy', 'geolocation=()');
    }
}