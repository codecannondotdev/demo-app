<?php

namespace Database\Seeders;

use Database\Factories\TreatmentFactory;
use Illuminate\Database\Seeder;

class TreatmentSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new TreatmentFactory)
            ->count(50)
            ->create();

        foreach ($entities as $entity) {
            $entity->medications()->attach($this->getRandomIdArray());
        }
    }

    private function getRandomIdArray()
    {
        $ids = range(1, 50);
        shuffle($ids);

        return array_slice($ids, 0, rand(1, 8));
    }
}
