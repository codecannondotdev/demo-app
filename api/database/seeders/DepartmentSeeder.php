<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\DepartmentFactory;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new DepartmentFactory)
            ->count(50)
            ->create();

        SeederHelper::seedHasMany($entities, 'nurses');
        SeederHelper::seedHasMany($entities, 'doctors');
        SeederHelper::seedHasMany($entities, 'appointments');
    }
}
