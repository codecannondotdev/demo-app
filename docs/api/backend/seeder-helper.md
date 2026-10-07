---
outline: 'deep'
---

# `SeederHelper`

The `SeederHelper` is a helper class that is used to seed database relations in Laravel seeders.
It provides static methods to automatically attach related models to entities for various relation types.

- See also
  - [Backend - Seeder Helper](/backend/seeder-helper)

## Class

```php
<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Collection as SupportCollection;
use InvalidArgumentException;

class SeederHelper
{
    /**
     * Seed hasMany relations by attaching existing unassigned related models to entities.
     *
     * @param  Collection<int, Model>|SupportCollection<int, Model>|Model  $entities  Collection of entities or single entity to attach relations to
     * @param  string  $relation  Relation name on the entity model
     */
    public static function seedHasMany(Collection|SupportCollection|Model $entities, string $relation): void

    /**
     * Seed hasOne relations by attaching existing unassigned related models to entities.
     *
     * @param  Collection<int, Model>|SupportCollection<int, Model>|Model  $entities  Collection of entities or single entity to attach relations to
     * @param  string  $relation  Relation name on the entity model
     */
    public static function seedHasOne(Collection|SupportCollection|Model $entities, string $relation): void

    /**
     * Seed belongsTo relations by associating entities with existing parent models.
     *
     * @param  Collection<int, Model>|SupportCollection<int, Model>|Model  $entities  Collection of entities or single entity to associate with parents
     * @param  string  $relation  BelongsTo relation name on the entity model
     */
    public static function seedBelongsTo(Collection|SupportCollection|Model $entities, string $relation): void

    /**
     * Seed belongsTo relations for hasOne inverse (ensures 1:1 constraint).
     * Only associates entities with parent models that don't already have the relation.
     *
     * @param  Collection<int, Model>|SupportCollection<int, Model>|Model  $entities  Collection of entities or single entity to associate with parents
     * @param  string  $relation  BelongsTo relation name on the entity model
     * @param  string  $parentRelationName  The hasOne relation name on the parent model
     */
    public static function seedBelongsToOne(Collection|SupportCollection|Model $entities, string $relation, string $parentRelationName): void

    /**
     * Seed belongsToMany relations by attaching existing related models to entities.
     *
     * @param  Collection<int, Model>|SupportCollection<int, Model>|Model  $entities  Collection of entities or single entity to attach relations to
     * @param  string  $relation  Relation name on the entity model
     */
    public static function seedBelongsToMany(Collection|SupportCollection|Model $entities, string $relation): void
}
```

## Methods

### `seedHasMany`

- **Type**: `(Collection|SupportCollection|Model $entities, string $relation) => void`
- **Description**: Seeds hasMany relations by attaching existing unassigned related models to entities. For each entity, it randomly attaches 1-3 unassigned related models (or fewer if not enough are available).

**Parameters:**
- `$entities` - Collection of entities or a single entity to attach relations to
- `$relation` - Relation name on the entity model (must be a HasMany relation)

**Example:**
```php
$users = User::factory()->count(50)->create();
SeederHelper::seedHasMany($users, 'posts');
```

### `seedHasOne`

- **Type**: `(Collection|SupportCollection|Model $entities, string $relation) => void`
- **Description**: Seeds hasOne relations by attaching existing unassigned related models to entities. Only attaches if the entity doesn't already have the relation.

**Parameters:**
- `$entities` - Collection of entities or a single entity to attach relations to
- `$relation` - Relation name on the entity model (must be a HasOne relation)

**Example:**
```php
$users = User::factory()->count(50)->create();
SeederHelper::seedHasOne($users, 'profile');
```

### `seedBelongsTo`

- **Type**: `(Collection|SupportCollection|Model $entities, string $relation) => void`
- **Description**: Seeds belongsTo relations by associating entities with existing parent models. Randomly distributes entities across available parent models (1-3 entities per parent).

**Parameters:**
- `$entities` - Collection of entities or a single entity to associate with parents
- `$relation` - BelongsTo relation name on the entity model

**Example:**
```php
$posts = Post::factory()->count(50)->create();
SeederHelper::seedBelongsTo($posts, 'user');
```

### `seedBelongsToOne`

- **Type**: `(Collection|SupportCollection|Model $entities, string $relation, string $parentRelationName) => void`
- **Description**: Seeds belongsTo relations for hasOne inverse relations. Ensures a 1:1 constraint by only associating entities with parent models that don't already have the relation.

**Parameters:**
- `$entities` - Collection of entities or a single entity to associate with parents
- `$relation` - BelongsTo relation name on the entity model
- `$parentRelationName` - The hasOne relation name on the parent model

**Example:**
```php
$profiles = Profile::factory()->count(50)->create();
SeederHelper::seedBelongsToOne($profiles, 'user', 'profile');
```

### `seedBelongsToMany`

- **Type**: `(Collection|SupportCollection|Model $entities, string $relation) => void`
- **Description**: Seeds belongsToMany relations by attaching existing related models to entities. For each entity, it randomly attaches 1-8 related models (or fewer if not enough are available). Uses actual related model IDs from the database.

**Parameters:**
- `$entities` - Collection of entities or a single entity to attach relations to
- `$relation` - Relation name on the entity model (must be a BelongsToMany relation)

**Example:**
```php
$posts = Post::factory()->count(50)->create();
SeederHelper::seedBelongsToMany($posts, 'tags');
```

## Usage in Seeders

The `SeederHelper` is typically used in Laravel database seeders to automatically populate relations:

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
        SeederHelper::seedBelongsToMany($entities, 'tags');
    }
}
```

## Error Handling

All methods throw `InvalidArgumentException` if:
- The relation does not exist on the entity model
- The relation type doesn't match the expected type (e.g., calling `seedHasMany` on a HasOne relation)


