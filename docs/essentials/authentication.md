---
outline: 'deep'
---

# Authentication

Generated apps sign users in with Laravel Fortify and keep them signed in with Sanctum cookie sessions. The Vue frontend sends backend requests with credentials. Laravel puts the CSRF token in the `XSRF-TOKEN` cookie, and Axios copies it into a request header. Paths on this page are relative to `VITE_BACKEND_URL`.

## Endpoints

| Method | Path | Handler | Notes |
| --- | --- | --- | --- |
| POST | `/login` | Fortify | `email`, `password`, `remember` |
| POST | `/register` | Fortify, `CreateNewUser` | Signs the new user in |
| POST | `/logout` | `AuthController` | Returns 204 |
| GET | `/user` | `AuthController` | Current user, or 401 |
| GET | `/heartbeat` | Route closure | Returns server time, refreshes session and CSRF cookies |
| POST | `/forgot-password` | `AuthController` | Sends a reset link |
| POST | `/reset-password` | `AuthController` | Sets the password and signs the user in |
| POST | `/email/verification-notification` | `AuthController` | Requires auth. Sends a new verification link |
| GET | `/email/verify/{id}/{hash}` | `AuthController` | Requires auth and a signed URL |

## Login and registration

`useAuthStore().login({ email, password, remember })` posts to `/login` and then loads `/user`. Wrong credentials return 422 with the message in `errors.email`. Fortify allows 15 login attempts per minute for each email and IP pair, then returns 429.

Registration posts `email`, `password`, and `password_confirmation`, plus the email again as `name`. `CreateNewUser` validates the input, creates the user, and signs them in. The new user then lands on the verification notice.

### Route guard

`ui/src/router/guards/authGuard.ts` loads the user on the first protected navigation and reads these route meta flags:

- `unprotected: true` opens the route to everyone.
- `avoidUser: true` marks pages for signed-out users, such as login. Signed-in users go to `root`.
- `roles: ['admin']` limits the route to the listed roles. Other users go to `root`.

Signed-in users with an unverified email go to `verify-email-notice` from any protected route.

## Remembered login

Sessions expire after `SESSION_LIFETIME` idle minutes, 120 by default. When a user checks "Remember me", Laravel also sets a `remember_web_<hash>` cookie. A valid remember cookie restores their login after the session expires.

A login without "Remember me" expires any remember cookie already in that browser, including the automatic login after registration or a password reset. A `Login` event listener in `AuthServiceProvider` handles this.

Logging out deletes the cookie and rotates the user's remember token. Other browsers will prompt for a fresh login when their current sessions expire. A password reset also rotates the remember token.

## Expired sessions and CSRF recovery

`useAuth()` in `ui/src/composables/useAuth.ts` loads the current user on mount and registers Axios interceptors for backend requests. It removes them on unmount, so call it from a component that stays mounted for the life of the app.

When a write returns 419 `CSRF token mismatch.`, the interceptor recovers POST, PUT, PATCH, and DELETE requests on its own:

1. It calls `GET /heartbeat`. The session middleware on this route restores a remembered login, and the response sets fresh session and `XSRF-TOKEN` cookies. Concurrent 419s share one heartbeat.
2. It sends the original request again with the same payload, options, and `X-Expected-User-Id` header.

The retried request resolves the original call, so a form save finishes as usual. Each request gets one retry. If the heartbeat or the retry fails, the caller receives that error.

A 401 while a user is loaded, or a 409 with `code: "AUTH_ACCOUNT_CHANGED"`, clears the auth store and navigates to `/login`. The route guard reloads the user during that navigation. A tab whose session now belongs to another account ends on that account's home or verification page. A tab with no login stays on sign-in. A "Session changed" toast explains which case happened.

### Expected-user header

The frontend includes `X-Expected-User-Id` on ordinary writes, using the loaded user's ID or `guest`. Retries keep the original value. The `EnsureExpectedUser` middleware returns 409 `AUTH_ACCOUNT_CHANGED` when the value differs from the session's user, for example after another tab switched accounts.

## Password reset

1. `POST /forgot-password` with `email` requests a reset email and returns 200 with a password broker status such as `passwords.sent`.
2. The email links to `{app.ui_url}/reset-password?token=...&email=...`. `AuthServiceProvider` builds this URL.
3. The reset page posts `token`, `email`, `password`, and `password_confirmation`. Passwords need at least 8 characters and a matching confirmation.

A successful reset returns 200 and signs the user in. An invalid or expired token returns 422 with a `message`.

## Email verification

The `User` model implements `MustVerifyEmail`, so registration sends a `CustomVerifyEmail` notification. It signs the `/email/verify/{id}/{hash}` route and swaps `app.url` for `app.ui_url`, so the link opens the frontend, which forwards the path and query string to the backend. Links expire after `auth.verification.expire` minutes, 60 by default. If links point at the API, check that `APP_URL` matches the backend's public URL.

The user must be signed in as the account in the link. The verification endpoint returns:

- 200 when the email is verified, or already was
- 400 for an invalid or expired signature
- 401 when nobody is signed in
- 403 when the link belongs to another account

`POST /email/verification-notification` sends a new link, or returns 400 if the email is already verified. Users that an admin creates through `UserController::store` start out verified.

## Authorization

The backend enforces permissions. Route roles in the frontend decide which pages a user can open.

`api/app/Policies/UserPolicy.php` holds the user rules. Any signed-in user can list and view users. Only admins can create them. Admins and the users themselves can update, edit relations, and delete. `UserController` calls `Gate::authorize` for each action and refuses to delete the last admin.

The user management routes in `ui/src/router/index.ts` have `meta: { roles: ['admin'] }`. Remove it from `users-list` to show the list to every signed-in user, since the policy already allows listing. To open create, update, or delete to more users, change the matching policy method as well.

## Customization reference

| Path | Controls |
| --- | --- |
| `api/config/fortify.php` | Enabled Fortify features, username field, route prefix |
| `api/app/Providers/FortifyServiceProvider.php` | Login limit and the `web` and `api` request limits |
| `api/app/Actions/Fortify/CreateNewUser.php` | Registration fields and validation |
| `api/app/Providers/AuthServiceProvider.php` | Reset link URL, remember cookie cleanup |
| `api/app/Http/Controllers/AuthController.php` | Logout, current user, password reset, verification |
| `api/app/Notifications/CustomVerifyEmail.php` | Verification email text and link |
| `api/app/Http/Middleware/EnsureExpectedUser.php` | Expected-user check |
| `api/config/session.php` | `SESSION_LIFETIME`, `SESSION_DOMAIN`, `SESSION_SECURE_COOKIE` |
| `api/config/sanctum.php` | `SANCTUM_STATEFUL_DOMAINS`: frontend hosts with any non-default ports |
| `api/app/Policies/UserPolicy.php` | User permissions |
| `ui/src/router/guards/authGuard.ts` | Login, verification, and role redirects |
| `ui/src/composables/useAuth.ts` | 401 and 409 handling, CSRF retry |
| `ui/src/views/Auth/` | Login, registration, reset, and verification screens |
