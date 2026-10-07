<?php

use App\Http\Middleware\EnsureExpectedUser;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Sentry\Laravel\Integration;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->group('web', [
            EnsureFrontendRequestsAreStateful::class,
            ThrottleRequests::class.':web',
            SubstituteBindings::class,
            EnsureExpectedUser::class,
        ]);
        $middleware->group('api', [
            EnsureFrontendRequestsAreStateful::class,
            ThrottleRequests::class.':api',
            SubstituteBindings::class,
            EnsureExpectedUser::class,
        ]);

        $middleware->trimStrings(except: [
            'current_password',
            'password',
            'password_confirmation',
        ]);
        $middleware->redirectGuestsTo(
            fn (Request $request): ?string => $request->expectsJson()
                ? null
                : config('app.ui_url').'/login',
        );
        $middleware->redirectUsersTo('/');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->dontFlash([
            'current_password',
            'password',
            'password_confirmation',
        ]);
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request): bool => $request->is('api/*') || $request->expectsJson(),
        );

        if (class_exists(Integration::class)) {
            Integration::handles($exceptions);
        }
    })->create();
