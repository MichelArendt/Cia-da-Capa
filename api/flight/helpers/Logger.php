<?php

namespace Helpers;

class Logger
{
    private static function getLogPath(): string
    {
        // Adjust path if needed
        $dir = __DIR__ . '/../logs';

        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        return $dir . '/app.log';
    }

    public static function error(string $message): void
    {
        $date = date('Y-m-d H:i:s');
        $line = "[{$date}] ERROR: {$message}" . PHP_EOL;

        file_put_contents(self::getLogPath(), $line, FILE_APPEND);
    }

    public static function info(string $message): void
    {
        $date = date('Y-m-d H:i:s');
        $line = "[{$date}] INFO: {$message}" . PHP_EOL;

        file_put_contents(self::getLogPath(), $line, FILE_APPEND);
    }
}