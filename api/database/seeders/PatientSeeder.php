<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\PatientFactory;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new PatientFactory)
            ->count(50)
            ->create();

        SeederHelper::seedHasMany($entities, 'billings');
        SeederHelper::seedHasMany($entities, 'treatments');
        SeederHelper::seedHasMany($entities, 'appointments');
    }
}
