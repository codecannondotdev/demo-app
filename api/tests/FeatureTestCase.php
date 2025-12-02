<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class FeatureTestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // Run standard migrations
        $this->artisan('migrate');
        $this->artisan('db:seed');

        // Run test-specific migrations
        $this->loadTestMigrations();
    }

    protected function loadTestMigrations()
    {
        $this->artisan('migrate', [
            '--path' => 'database/migrations',
            '--realpath' => true,
        ]);
    }
}
