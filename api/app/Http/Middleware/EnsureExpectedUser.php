<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureExpectedUser
{
    /**
     * Reject browser writes sent for a different account, without replacing authentication.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $expectedUser = $request->header('X-Expected-User-Id');
        if (! $request->isMethodSafe() && $expectedUser !== null) {
            $actualUser = Auth::id();
            if ($expectedUser !== ($actualUser === null ? 'guest' : (string) $actualUser)) {
                return response()->json([
                    'code' => 'AUTH_ACCOUNT_CHANGED',
                    'message' => 'The signed-in account changed. The request was not processed.',
                ], Response::HTTP_CONFLICT);
            }
        }

        return $next($request);
    }
}
