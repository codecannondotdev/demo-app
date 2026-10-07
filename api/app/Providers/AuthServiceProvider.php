<?php

namespace App\Providers;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\SessionGuard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        Event::listen(Login::class, function (Login $event): void {
            $guard = Auth::guard($event->guard);
            if (! $event->remember && $guard instanceof SessionGuard) {
                Cookie::expire($guard->getRecallerName());
            }
        });

        ResetPassword::createUrlUsing(function ($user, string $token) {
            return config('app.ui_url').'/reset-password?token='.$token.'&email='.$user->getEmailForPasswordReset();
        });
    }
}
