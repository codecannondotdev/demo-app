<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\TagFactory;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new TagFactory)
            ->count(50)
            ->create();

        SeederHelper::seedBelongsToMany($entities, 'medications');
    }
}
