<?php

use Laravel\Sanctum\Sanctum;

return [

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost:3000,127.0.0.1:3000',
        Sanctum::currentApplicationUrlWithPort(),
    ))),

    'guard' => ['web'],

    // Personal access tokens are not used at launch; the SPA cookie session is the only client.
    'expiration' => null,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', 'jm_'),

    'middleware' => [
        'authenticate_session' => Laravel\Session\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],

];
