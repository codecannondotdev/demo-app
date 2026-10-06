<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\AppointmentFactory;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new AppointmentFactory)
            ->count(50)
            ->create();

        SeederHelper::seedBelongsTo($entities, 'patient');
        SeederHelper::seedBelongsTo($entities, 'doctor');
        SeederHelper::seedBelongsTo($entities, 'nurse');
        SeederHelper::seedBelongsTo($entities, 'department');
        SeederHelper::seedHasMany($entities, 'billing');
    }
}
