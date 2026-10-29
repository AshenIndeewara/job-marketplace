<?php

use App\Http\Middleware\RequestIdMiddleware;
use App\Http\Middleware\SetLocaleFromAcceptLanguage;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Every API request gets a request ID and a resolved locale before anything else.
        $middleware->api(prepend: [
            RequestIdMiddleware::class,
            SetLocaleFromAcceptLanguage::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // One JSON error format for the whole API (JM-27):
        // { "error": { "code": "...", "message": "...", "errors": { "field": [ ... ] } } }
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null; // non-API routes keep the default handler
            }

            $payload = match (true) {
                $e instanceof ValidationException => [
                    'status' => 422,
                    'code' => 'validation_error',
                    'message' => __('The given data was invalid.'),
                    'errors' => $e->errors(),
                ],
                $e instanceof AuthenticationException => [
                    'status' => 401,
                    'code' => 'unauthenticated',
                    'message' => __('Unauthenticated.'),
                ],
                $e instanceof AuthorizationException => [
                    'status' => 403,
                    'code' => 'forbidden',
                    'message' => __('This action is unauthorized.'),
                ],
                $e instanceof TokenMismatchException => [
                    'status' => 419,
                    'code' => 'csrf_token_mismatch',
                    'message' => __('CSRF token mismatch.'),
                ],
                $e instanceof ThrottleRequestsException => [
                    'status' => 429,
                    'code' => 'too_many_requests',
                    'message' => __('Too many requests. Please slow down.'),
                    'retry_after' => $e->getHeaders()['Retry-After'] ?? null,
                ],
                $e instanceof ModelNotFoundException,
                $e instanceof NotFoundHttpException => [
                    'status' => 404,
                    'code' => 'not_found',
                    'message' => __('Not found.'),
                ],
                $e instanceof MethodNotAllowedHttpException => [
                    'status' => 405,
                    'code' => 'method_not_allowed',
                    'message' => __('Method not allowed.'),
                ],
                $e instanceof HttpExceptionInterface => [
                    'status' => $e->getStatusCode(),
                    'code' => 'http_error',
                    'message' => __('Error.'),
                ],
                default => [
                    'status' => 500,
                    'code' => 'server_error',
                    // Never leak stack traces in production.
                    'message' => config('app.debug') ? $e->getMessage() : __('Server error.'),
                ],
            };

            $retryAfter = $payload['retry_after'] ?? null;
            unset($payload['retry_after']);

            $headers = $retryAfter !== null ? ['Retry-After' => (string) $retryAfter] : [];

            return response()->json(['error' => $payload], $payload['status'], $headers);
        });
    })->create();
