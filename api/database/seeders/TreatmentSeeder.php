<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\TreatmentFactory;
use Illuminate\Database\Seeder;

class TreatmentSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new TreatmentFactory)
            ->count(50)
            ->create();

        SeederHelper::seedBelongsTo($entities, 'patient');
        SeederHelper::seedBelongsTo($entities, 'doctor');
        SeederHelper::seedBelongsToMany($entities, 'medications');
    }
}
