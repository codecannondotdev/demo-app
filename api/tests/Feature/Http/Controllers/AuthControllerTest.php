<?php

use App\Models\User;
use App\Notifications\CustomVerifyEmail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

test('user can get profile when authenticated', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/user');

    $response->assertStatus(200)
        ->assertJson([
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
        ]);
});

test('user profile returns 401 when not authenticated', function () {
    $response = $this->getJson('/user');

    // API requests should return 401 Unauthorized
    $response->assertStatus(401);
});

test('email verification notification sends email', function () {
    Notification::fake();

    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $response = $this->actingAs($user)
        ->postJson('/email/verification-notification');

    $response->assertStatus(200);
    Notification::assertSentTo($user, CustomVerifyEmail::class);
});

test('email verification notification requires authentication', function () {
    $response = $this->postJson('/email/verification-notification');

    // API requests should return 401 for unauthenticated requests
    $response->assertStatus(401);
});

test('verify email verifies user', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    // Create a signed verification URL
    $hash = sha1($user->email);
    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => $hash]
    );

    // Extract the query parameters
    $parsedUrl = parse_url($verificationUrl);
    parse_str($parsedUrl['query'] ?? '', $queryParams);

    // Make a direct request to the verification endpoint
    $response = $this->actingAs($user)
        ->getJson("/email/verify/{$user->id}/{$hash}?expires={$queryParams['expires']}&signature={$queryParams['signature']}");

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    $response->assertStatus(200);
});

test('verify email with invalid signature does not verify user', function () {
    // This test checks that if the URL signature (query parameter) is invalid,
    // the email is not verified, even if the path hash is correct.
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $correctHash = sha1($user->email);
    $invalidSignature = Str::random(40); // A random, incorrect signature
    $expires = now()->addMinutes(60)->timestamp;

    $response = $this->actingAs($user)
        ->getJson("/email/verify/{$user->id}/{$correctHash}?expires={$expires}&signature={$invalidSignature}");

    // Expect a 400 Bad Request due to invalid signature in query parameters
    $response->assertStatus(Response::HTTP_BAD_REQUEST);
    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('verify email with expired link does not verify user', function () {
    // This test checks that if the URL (via query parameters) is expired,
    // the email is not verified.
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    // Create an expired verification URL
    $hash = sha1($user->email); // Correct hash for the path
    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify', // Assuming this name is used for generation context, not direct routing
        now()->subMinutes(60), // Expired 60 minutes ago
        ['id' => $user->id, 'hash' => $hash]
    );

    // Extract the query parameters from the generated (expired) signed URL
    $parsedUrl = parse_url($verificationUrl);
    parse_str($parsedUrl['query'] ?? '', $queryParams);

    // Hit the endpoint directly with the correct path hash but expired query parameters
    $response = $this->actingAs($user)
        ->getJson("/email/verify/{$user->id}/{$hash}?expires={$queryParams['expires']}&signature={$queryParams['signature']}");

    // Expect a 400 Bad Request due to expired link
    $response->assertStatus(Response::HTTP_BAD_REQUEST);
    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('verify email prevents other users from verifying someone else\'s email', function () {
    // This test documents the current behavior, which is that users can't verify other users' emails
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $otherUser = User::factory()->create();

    // Create a signed verification URL for the original user
    $hash = sha1($user->email);
    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => $hash]
    );

    // Extract the query parameters
    $parsedUrl = parse_url($verificationUrl);
    parse_str($parsedUrl['query'] ?? '', $queryParams);

    // Try to verify with a different user
    $response = $this->actingAs($otherUser)
        ->getJson("/email/verify/{$user->id}/{$hash}?expires={$queryParams['expires']}&signature={$queryParams['signature']}");

    // The current implementation prevents this
    $response->assertStatus(403);
    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('logout removes session', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/logout');

    $response->assertStatus(204);
    $this->assertGuest();
});

test('logout works even when not authenticated', function () {
    $response = $this->postJson('/logout');

    $response->assertStatus(204);
});

test('forgot password sends reset link', function () {
    // Mock the Password facade
    Password::shouldReceive('sendResetLink')
        ->once()
        ->andReturn(Password::RESET_LINK_SENT);

    $user = User::factory()->create();

    $response = $this->postJson('/forgot-password', [
        'email' => $user->email,
    ]);

    $response->assertStatus(200);
});

test('forgot password validates email format', function () {
    $response = $this->postJson('/forgot-password', [
        'email' => 'not-an-email',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('forgot password handles non-existent email', function () {
    // Mock the Password facade to return user not found
    Password::shouldReceive('sendResetLink')
        ->once()
        ->andReturn(Password::INVALID_USER);

    $response = $this->postJson('/forgot-password', [
        'email' => 'nonexistent@example.com',
    ]);

    $response->assertStatus(200);
});

test('reset password updates user password', function () {
    $user = User::factory()->create();
    $token = app('auth.password.broker')->createToken($user);

    $response = $this->postJson('/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'newpassword',
        'password_confirmation' => 'newpassword',
    ]);

    $response->assertStatus(200);
});

test('reset password validates required fields', function () {
    $response = $this->postJson('/reset-password', [
        'token' => '',
        'email' => '',
        'password' => '',
        'password_confirmation' => '',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['token', 'email', 'password']);
});

test('reset password validates password confirmation', function () {
    $user = User::factory()->create();
    $token = app('auth.password.broker')->createToken($user);

    $response = $this->postJson('/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'newpassword',
        'password_confirmation' => 'differentpassword',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

test('reset password validates password length', function () {
    $user = User::factory()->create();
    $token = app('auth.password.broker')->createToken($user);

    $response = $this->postJson('/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'short',
        'password_confirmation' => 'short',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

test('reset password handles invalid token', function () {
    // Mock the Password facade to return invalid token
    Password::shouldReceive('reset')
        ->once()
        ->andReturn(Password::INVALID_TOKEN);

    $user = User::factory()->create();

    $response = $this->postJson('/reset-password', [
        'token' => 'invalid-token',
        'email' => $user->email,
        'password' => 'newpassword',
        'password_confirmation' => 'newpassword',
    ]);

    $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
});
