<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\NurseFactory;
use Illuminate\Database\Seeder;

class NurseSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new NurseFactory)
            ->count(50)
            ->create();

        SeederHelper::seedBelongsTo($entities, 'department');
        SeederHelper::seedHasMany($entities, 'appointments');
    }
}
