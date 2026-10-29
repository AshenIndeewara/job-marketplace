<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Sets the app locale for API requests (JM-27): the signed-in user's
 * preferred_locale wins, otherwise we negotiate from Accept-Language.
 * Supported: en, si, ta. Validation and error messages follow this locale.
 */
class SetLocaleFromAcceptLanguage
{
    private const SUPPORTED = ['en', 'si', 'ta'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->user()?->preferred_locale;

        if (! in_array($locale, self::SUPPORTED, true)) {
            $locale = $request->getPreferredLanguage(self::SUPPORTED) ?? 'en';
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
