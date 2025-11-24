<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class HelperTestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // Run standard migrations
        $out = $this->artisan('migrate');

        // Run test-specific migrations
        $this->loadTestMigrations();
    }

    protected function loadTestMigrations()
    {
        $this->artisan('migrate', [
            '--path' => 'database/migrations/testing',
            '--realpath' => true,
        ]);
    }
}
