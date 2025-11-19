<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\MedicationFactory;
use Illuminate\Database\Seeder;

class MedicationSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new MedicationFactory)
            ->count(50)
            ->create();

        SeederHelper::seedBelongsToMany($entities, 'tags');
        SeederHelper::seedBelongsToMany($entities, 'treatments');
    }
}
