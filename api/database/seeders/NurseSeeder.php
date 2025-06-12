<?php

namespace Database\Seeders;

use Database\Factories\NurseFactory;
use Illuminate\Database\Seeder;

class NurseSeeder extends Seeder
{
    public function run(): void
    {
        (new NurseFactory)
            ->count(50)
            ->create();
    }
}
