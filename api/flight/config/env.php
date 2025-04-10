<?php

function loadEnv(string $envPath): void {
    if (!file_exists($envPath)) {
        throw new Exception(".env file not found: $envPath");
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, "\"' "); // Remove quotes/spaces

        $_ENV[$key] = $value;
        putenv("$key=$value");
    }
}
