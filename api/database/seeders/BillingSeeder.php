<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\BillingFactory;
use Illuminate\Database\Seeder;

class BillingSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new BillingFactory)
            ->count(50)
            ->create();

        SeederHelper::seedBelongsTo($entities, 'patient');
        SeederHelper::seedBelongsTo($entities, 'appointment');
    }
}
