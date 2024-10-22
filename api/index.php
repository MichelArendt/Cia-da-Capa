<?php

// Define the path to the public directory
define('LARAVEL_PUBLIC_PATH', __DIR__ . '/public');

// Change the current directory to the public directory
chdir(LARAVEL_PUBLIC_PATH);

// Correct the script filename
$_SERVER['SCRIPT_FILENAME'] = LARAVEL_PUBLIC_PATH . '/index.php';
$_SERVER['SCRIPT_NAME'] = '/api/index.php';

// Include the original index.php from the public directory
require LARAVEL_PUBLIC_PATH . '/index.php';
