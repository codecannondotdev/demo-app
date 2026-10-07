---
outline: 'deep'
---

# `SeederHelper`

The `SeederHelper` class is a helper that simplifies seeding database relations in Laravel seeders.
It provides static methods to automatically attach related models to entities for various relation types.

- See also
  - [API - `SeederHelper`](/api/backend/seeder-helper)

## Usage

The `SeederHelper` class provides static methods for seeding different types of relations. It's typically used in Laravel database seeders to automatically populate relations after creating model instances.

### Seeding HasMany Relations

Use `seedHasMany` to attach related models in a one-to-many relationship. This method attaches 1-3 unassigned related models to each entity.

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

        SeederHelper::seedHasMany($entities, 'comments');
    }
}
```

The method finds all unassigned related models (where the foreign key is `null` or `0`) and randomly assigns them to the entities.

### Seeding HasOne Relations

Use `seedHasOne` to attach a single related model in a one-to-one relationship. Only attaches if the entity doesn't already have the relation.

```php
<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\UserFactory;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new UserFactory)
            ->count(50)
            ->create();

        SeederHelper::seedHasOne($entities, 'profile');
    }
}
```

### Seeding BelongsTo Relations

Use `seedBelongsTo` to associate entities with parent models. This randomly distributes entities across available parent models (1-3 entities per parent).

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
    }
}
```

### Seeding BelongsToOne Relations (1:1 Inverse)

Use `seedBelongsToOne` when seeding the inverse side of a HasOne relation. This ensures a 1:1 constraint by only associating entities with parent models that don't already have the relation.

```php
<?php

namespace Database\Seeders;

use App\Helpers\SeederHelper;
use Database\Factories\ProfileFactory;
use Illuminate\Database\Seeder;

class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        $entities = (new ProfileFactory)
            ->count(50)
            ->create();

        // 'user' is the belongsTo relation, 'profile' is the hasOne relation on User
        SeederHelper::seedBelongsToOne($entities, 'user', 'profile');
    }
}
```

### Seeding BelongsToMany Relations

Use `seedBelongsToMany` to attach related models in a many-to-many relationship. This method attaches 1-8 related models to each entity, using actual related model IDs from the database.

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

        SeederHelper::seedBelongsToMany($entities, 'tags');
    }
}
```

## Combining Multiple Relations

You can seed multiple relations in a single seeder:

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

        // Seed multiple relations
        SeederHelper::seedBelongsTo($entities, 'user');
        SeederHelper::seedHasMany($entities, 'comments');
        SeederHelper::seedBelongsToMany($entities, 'tags');
    }
}
```

## Error Handling

All methods throw `InvalidArgumentException` if:
- The relation does not exist on the entity model
- The relation type doesn't match the expected type (e.g., calling `seedHasMany` on a HasOne relation)

Make sure your models have the corresponding relation methods defined before using the seeder helper.


