<?php

use App\Models\User;
use App\Notifications\CustomVerifyEmail;
use Illuminate\Support\Facades\Notification;

test('user has verified attribute', function () {
    $unverifiedUser = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $verifiedUser = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    expect($unverifiedUser->verified)->toBeFalse();
    expect($verifiedUser->verified)->toBeTrue();
});

test('admin role check', function () {
    $regularUser = User::factory()->create([
        'role' => 'user',
    ]);

    $adminUser = User::factory()->create([
        'role' => 'admin',
    ]);

    expect($regularUser->isAdmin())->toBeFalse();
    expect($adminUser->isAdmin())->toBeTrue();
});

test('user sends custom verification email', function () {
    Notification::fake();

    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $user->sendEmailVerificationNotification();

    Notification::assertSentTo($user, CustomVerifyEmail::class);
});
