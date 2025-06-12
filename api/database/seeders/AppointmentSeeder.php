<?php

namespace Database\Seeders;

use Database\Factories\AppointmentFactory;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        (new AppointmentFactory)
            ->count(50)
            ->create();
    }
}
