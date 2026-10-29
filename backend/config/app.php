<?php

return [

    'name' => env('APP_NAME', 'Job Marketplace'),
    'env' => env('APP_ENV', 'local'),
    'debug' => (bool) env('APP_DEBUG', true),
    'url' => env('APP_URL', 'http://localhost:8000'),

    // Display timezone (PRS): users see Colombo time. Database stays UTC (see config/database.php).
    'timezone' => env('APP_TIMEZONE', 'Asia/Colombo'),

    // Supported UI languages: English, Sinhala, Tamil.
    'locale' => env('APP_LOCALE', 'en'),
    'fallback_locale' => 'en',
    'faker_locale' => 'en_US',

    'cipher' => 'AES-256-CBC',
    'key' => env('APP_KEY'),

    'maintenance' => [
        'driver' => 'file',
    ],

];
