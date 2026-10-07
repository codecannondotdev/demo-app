# Seeders

Seeders are generated for each module depending on the module specification.

```php
<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\PostFactory;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new PostFactory)
            ->count(50)
            ->create();

        SeederHelper::seedBelongsTo($entities, 'user');
        SeederHelper::seedBelongsToMany($entities, 'tags');
    }
}
```

The seeders create 50 entities using the module's factory.

If the entities have any relations, the relations are automatically seeded using the `SeederHelper` class. The helper methods handle:
- **HasMany** relations - Attaches 1-3 unassigned related models to each entity
- **HasOne** relations - Attaches a single unassigned related model to each entity (if not already attached)
- **BelongsTo** relations - Associates entities with parent models (1-3 entities per parent)
- **BelongsToOne** relations - Associates entities with parent models that don't already have the relation (ensures 1:1 constraint for HasOne inverse relations)
- **BelongsToMany** relations - Attaches 1-8 related models to each entity using actual model IDs from the database

- See also
  - [Backend - Seeder Helper](/backend/seeder-helper)
  - [API - Seeder Helper](/api/backend/seeder-helper)

The seeders are added to the main `DatabaseSeeder` file.

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (User::count() > 0) {
            return;
        }
        $this->call([UserSeeder::class, ProfileSeeder::class, AddressSeeder::class]);
    }
}
