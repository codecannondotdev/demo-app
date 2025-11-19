<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        Log::debug('Returning user', ['user_id' => $request->user()->id]);

        return $request->user();
    }

    public function emailVerificationNotification(Request $request)
    {
        // If user is already verified, return 400 Bad Request
        if ($request->user()->hasVerifiedEmail()) {
            return new Response(status: 400);
        }

        Log::debug('Sending email verification mail', ['user_id' => $request->user()->id]);
        $request->user()->sendEmailVerificationNotification();
    }

    public function verifyEmail(EmailVerificationRequest $request)
    {
        // EmailVerificationRequest's authorize() method already checks:
        // 1. Authenticated user's ID matches route {id}
        // 2. sha1 of authenticated user's email matches route {hash}
        // If authorize() fails, a 403 is automatically returned.

        // Now, we explicitly check the 'expires' and 'signature' query parameters.
        if (! $request->hasValidSignature()) {
            Log::debug('Email verification link is invalid or expired.', [
                'user_id' => $request->user()->id,
                'query_params' => $request->query(),
            ]);

            return new Response('Invalid or expired verification link.', Response::HTTP_BAD_REQUEST);
        }

        if ($request->user()->hasVerifiedEmail()) {
            Log::debug('Email already verified.', ['user_id' => $request->user()->id]);
            // For an API, returning a success status is fine, or a specific "already verified" message.
        } else {
            Log::debug('Verifying email', ['user_id' => $request->user()->id]);
            $request->fulfill();
        }

        return new Response(status: Response::HTTP_OK);
    }

    public function forgotPassword(Request $request)
    {
        Log::debug('Validating input');
        $request->validate(['email' => 'required|email']);

        Log::debug('Sending reset link');
        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status;
    }

    public function resetPassword(Request $request)
    {
        Log::debug('Validating input for password reset');
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                Log::debug('Updating user password', ['user_id' => $user->id]);
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));

                Log::debug('Logging in user after password reset', ['user_id' => $user->id]);
                Auth::guard('web')->login($user);
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            Log::info('Password reset successfully.', ['email' => $request->email]);

            return response()->json(['message' => trans($status)], Response::HTTP_OK);
        }

        Log::warning('Password reset failed.', ['email' => $request->email, 'status' => $status]);

        return response()->json(['message' => trans($status)], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function logout(Request $request)
    {
        Log::debug('Logging out');
        Auth::guard('web')->logout();

        Log::debug('Destroying session');
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return new Response(status: 204);
    }
}
