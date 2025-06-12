<?php

namespace Database\Seeders;

use Database\Factories\DoctorFactory;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        (new DoctorFactory)
            ->count(50)
            ->create();
    }
}
