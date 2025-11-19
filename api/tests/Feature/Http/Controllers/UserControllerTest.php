<?php

use App\Models\User;

beforeEach(function () {
    $this->admin = User::first();
});

test('user routes return 401 if user is not authenticated', function () {
    // List
    $response = $this->postJson('/api/users/list');
    $response->assertStatus(401);

    // Show
    $response = $this->getJson('/api/users/1');
    $response->assertStatus(401);

    // Store
    $response = $this->postJson('/api/users', []);
    $response->assertStatus(401);

    // Update
    $response = $this->putJson('/api/users/1', []);
    $response->assertStatus(401);

    // Destroy
    $response = $this->deleteJson('/api/users/1', []);
    $response->assertStatus(401);

    // Update relations
    $response = $this->putJson('/api/users/1/test', []);
    $response->assertStatus(401);
});

test('users list should return a list of users', function () {
    User::factory()->count(5)->create();

    $response = $this->actingAs(User::find(2))->postJson('/api/users/list');

    $response->assertStatus(200);
    expect(count($response->json()['data']))->toBe(6);
});

test('users show should return a user', function () {
    User::factory()->count(5)->create();

    $response = $this->actingAs(User::find(2))->getJson('/api/users/2');

    $response->assertStatus(200);
    expect($response->json()['email'])->toBe(User::find(2)->email);
});

test('users store should create a user', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/users', [
        'email' => 'test@google.com',
        'name' => 'test@google.com',
        'password' => 'test',
        'role' => 'user',
    ]);

    $response->assertStatus(201);
    expect($response->json()['email'])->toBe('test@google.com');
    expect(User::find(2))->toBeObject();
});

test('users store should return 403 if authenticated user is not admin', function () {
    User::factory()->count(1)->create();

    $response = $this->actingAs(User::find(2))->postJson('/api/users', [
        'email' => 'test@google.com',
        'name' => 'test@google.com',
        'password' => 'test',
        'role' => 'user',
    ]);

    $response->assertStatus(403);
});

test('users update should update the user', function () {
    User::factory()->count(1)->create();

    $response = $this->actingAs($this->admin)->putJson('/api/users/2', ['role' => 'admin']);

    $response->assertStatus(200);
    expect(User::find(2)->role)->toBe('admin');
});

test('users update should return 403 if authenticated user is not admin and updating other users', function () {
    User::factory()->count(1)->create();

    $response = $this->actingAs(User::find(2))->putJson('/api/users/1', ['role' => 'user']);

    $response->assertStatus(403);
});

test('users update should update user if authenticated user is not admin and updating itself', function () {
    User::factory()->count(1)->create();

    $response = $this->actingAs(User::find(2))->putJson('/api/users/2', ['name' => 'test']);

    $response->assertStatus(200);
});

test('users update should not update user role if authenticated user is not admin', function () {
    User::factory()->count(1)->create();

    $response = $this->actingAs(User::find(2))->putJson('/api/users/2', ['role' => 'admin']);

    $response->assertStatus(200);
    expect(User::find(2)->role)->toBe('user');
});

test('users update relation should update a relation', function () {
    $response = $this->actingAs($this->admin)->putJson('/api/users/1/apps', [
        'method' => 'associate',
        'params' => [1],
    ]);

    // We don't know which relations user will have at generation time, so just assert it's not forbidden
    expect($response->status())->not->toBe(401);
    expect($response->status())->not->toBe(403);
});

test('users update relation should return 403 if authenticated user is not admin and updating other users', function () {
    User::factory()->count(1)->create();

    $response = $this->actingAs(User::find(2))->putJson('/api/users/1/apps', [
        'method' => 'attach',
        'params' => [1],
    ]);

    $response->assertStatus(403);
});

test('users update relation should update relation if user is updating itself', function () {
    User::factory()->count(1)->create();

    $response = $this->actingAs(User::find(2))->putJson('/api/users/2/apps', [
        'method' => 'attach',
        'params' => [1],
    ]);

    // We don't know which relations user will have at generation time, so just assert it's not forbidden
    expect($response->status())->not->toBe(401);
    expect($response->status())->not->toBe(403);
});

test('users destroy should destroy the user', function () {
    User::factory()->count(1)->create();

    $response = $this->actingAs($this->admin)->deleteJson('/api/users/2');

    $response->assertStatus(200);
    expect(User::find(2))->toBe(null);
});

test('users destroy should return 403 if authenticated user is not admin and destroying other users', function () {
    User::factory()->count(1)->create();

    $response = $this->actingAs(User::find(2))->deleteJson('/api/users/1');

    $response->assertStatus(403);
});

test('users destroy should destroy user if authenticated user is not admin and destroying itself', function () {
    User::factory()->count(1)->create();

    $response = $this->actingAs(User::find(2))->deleteJson('/api/users/2');

    $response->assertStatus(200);
});

test('users destroy should return 403 if authenticated user is destroying last admin', function () {
    $response = $this->actingAs(User::find(1))->deleteJson('/api/users/1');

    $response->assertStatus(403);
    expect(User::find(1))->toBeObject();
});
