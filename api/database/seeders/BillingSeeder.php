<?php

namespace Database\Seeders;

use Database\Factories\BillingFactory;
use Illuminate\Database\Seeder;

class BillingSeeder extends Seeder
{
    public function run(): void
    {
        (new BillingFactory)
            ->count(50)
            ->create();
    }
}
