<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\DoctorFactory;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new DoctorFactory)
            ->count(50)
            ->create();

        SeederHelper::seedBelongsTo($entities, 'department');
        SeederHelper::seedHasMany($entities, 'treatments');
        SeederHelper::seedHasMany($entities, 'appointments');
    }
}
