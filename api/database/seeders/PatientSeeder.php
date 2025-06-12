<?php

namespace Database\Seeders;

use Database\Factories\PatientFactory;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        (new PatientFactory)
            ->count(50)
            ->create();
    }
}
