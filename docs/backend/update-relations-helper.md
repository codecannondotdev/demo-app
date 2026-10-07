---
outline: 'deep'
---

# `UpdateRelationsHelper`

The `UpdateRelationsHelper` class provides an api that allows you to update any
relation of a model via a single endpoint.

Laravel doesn't cover all relation updating scenarios out of the box (for example
there is no `associate` method for `HasMany` or `HasOne` relations). This helper
aims to provide a single endpoint that can handle all relation updates.

## `updateRelation`

It offers a single method `updateRelation` that takes a model instance and
relation update parameters and updates the model relation accordingly.

```php
<?php

$entity = User::find(1);

UpdateRelationsHelper::updateRelation($entity, 'posts', 'associate', [1]);
```

### `associate`

The `associate` method is used to associate a model with another model via the
`HasOne`, `HasMany` or `BelongsTo` relation.

```php
<?php

$entity = User::find(1);

UpdateRelationsHelper::updateRelation($entity, 'posts', 'associate', [1]);
```

The implementation of this logic works like this:

```php
<?php

// Ensure relation is either HasOne, HasMany, or BelongsTo
if (! (
    $model->{$relation}() instanceof HasOne ||
    $model->{$relation}() instanceof HasMany ||
    $model->{$relation}() instanceof BelongsTo
)) {
    throw new \InvalidArgumentException('The associate method is not supported for '.get_class($model->{$relation}()).' relation');
}

// Associate method for BelongsTo relation
if (! ($model->{$relation}() instanceof HasMany || $model->{$relation}() instanceof HasOne)) {
    // Ensure only one id is passed for BelongsTo relation
    if (count($params) > 1) {
        throw new \InvalidArgumentException('The associate method only supports one id for BelongsTo relation');
    }

    $model->{$relation}()->$method($params[0])->save();
    break;
}

// Ensure only one id is passed for HasOne relation
if ($model->{$relation}() instanceof HasOne && count($params) > 1) {
    throw new \InvalidArgumentException('The associate method only supports one id for HasOne relation');
}

// Dissociate first if relation is HasOne
if ($model->{$relation}() instanceof HasOne && ! is_null($model->{$relation})) {
    // Dissociate method for HasOne relation
    $model->{$relation}->update([
        $model->{$relation}()->getForeignKeyName() => null,
    ]);
}

// Associate method for HasMany and HasOne relations
foreach ($params as $param) {
    $model
        ->{$relation}()
        ->getRelated()
        ->findOrFail($param)
        ->update([
            $model->{$relation}()->getForeignKeyName() => $model->id,
        ]);
}
```

### `dissociate`

The `dissociate` method is used to dissociate a model from another model via the
`HasOne`, `HasMany` or `BelongsTo` relation.

```php
<?php

$entity = User::find(1);

UpdateRelationsHelper::updateRelation($entity, 'posts', 'dissociate', [1]);
```

The implementation of this logic works like this:

```php
<?php

// Ensure relation is either HasOne, HasMany, or BelongsTo
if (! (
    $model->{$relation}() instanceof HasOne ||
    $model->{$relation}() instanceof HasMany ||
    $model->{$relation}() instanceof BelongsTo
)) {
    throw new \InvalidArgumentException('The dissociate method is not supported for '.get_class($model->{$relation}()).' relation');
}

// Dissociate method for BelongsTo relation
if (! ($model->{$relation}() instanceof HasMany || $model->{$relation}() instanceof HasOne)) {
    $model->{$relation}()->dissociate()->save();
    break;
}

if ($model->{$relation}() instanceof HasOne) {
    // Dissociate method for HasOne relation
    $model->{$relation}()->update([
        $model->{$relation}()->getForeignKeyName() => null,
    ]);
    break;
} else {
    // Dissociate method for HasMany relation
    foreach ($params as $param) {
        $model
            ->{$relation}()
            ->getRelated()
            ->findOrFail($param)
            ->update([
                $model->{$relation}()->getForeignKeyName() => null,
            ]);
    }
}
```

### `attach`

The `attach` method is used to attach a model to another model via the `BelongsToMany`
relation.

```php
<?php

$entity = User::find(1);

UpdateRelationsHelper::updateRelation($entity, 'roles', 'attach', [1]);
```

The implementation of this logic works like this:

```php
<?php

// Ensure relation is BelongsToMany
if (! $model->{$relation}() instanceof BelongsToMany) {
    throw new \InvalidArgumentException('The attach method is not supported for '.get_class($model->{$relation}()).' relation');
}

// Attach method for BelongsToMany relation
$model->{$relation}()->$method($params);
```

### `detach`

The `detach` method is used to detach a model from another model via the `BelongsToMany`
relation.

```php
<?php

$entity = User::find(1);

UpdateRelationsHelper::updateRelation($entity, 'roles', 'detach', [1]);
```

The implementation of this logic works like this:

```php
<?php

// Ensure relation is BelongsToMany
if (! $model->{$relation}() instanceof BelongsToMany) {
    throw new \InvalidArgumentException('The detach method is not supported for '.get_class($model->{$relation}()).' relation');
}

// Detach method for BelongsToMany relation
$model->{$relation}()->$method($params);
```

### `sync`

The `sync` method is used to sync a model with another model via the `BelongsToMany`
relation.

```php
<?php

$entity = User::find(1);

UpdateRelationsHelper::updateRelation($entity, 'roles', 'sync', [1, 2, 3]);
```

The implementation of this logic works like this:

```php
<?php

// Ensure relation is BelongsToMany
if (! $model->{$relation}() instanceof BelongsToMany) {
    throw new \InvalidArgumentException('The sync method is not supported for '.get_class($model->{$relation}()).' relation');
}

// Sync method for BelongsToMany relation
$model->{$relation}()->$method($params);
```

### `toggle`

The `toggle` method is used to toggle a model with another model via the `BelongsToMany`
relation.

```php
<?php

$entity = User::find(1);

UpdateRelationsHelper::updateRelation($entity, 'roles', 'toggle', [1]);
```

The implementation of this logic works like this:

```php
<?php

// Ensure relation is BelongsToMany
if (! $model->{$relation}() instanceof BelongsToMany) {
    throw new \InvalidArgumentException('The toggle method is not supported for '.get_class($model->{$relation}()).' relation');
}

// Toggle method for BelongsToMany relation
$model->{$relation}()->$method($params);
```

### `syncWithoutDetaching`

The `syncWithoutDetaching` method is used to sync a model with another model via
the `BelongsToMany` relation without detaching any existing models.

```php
<?php

$entity = User::find(1);

UpdateRelationsHelper::updateRelation($entity, 'roles', 'syncWithoutDetaching', [1, 2, 3]);
```

The implementation of this logic works like this:

```php
<?php

// Ensure relation is BelongsToMany
if (! $model->{$relation}() instanceof BelongsToMany) {
    throw new \InvalidArgumentException('The syncWithoutDetaching method is not supported for '.get_class($model->{$relation}()).' relation');
}

// SyncWithoutDetaching method for BelongsToMany relation
$model->{$relation}()->$method($params);
```

## Review

The `UpdateRelationsHelper` class is a powerful tool that allows you to easily
update relations of a model via a single endpoint.

It's used in the `CRUDControllerHelper` to update relations of a model entity.

- See also
  - [API - `UpdateRelationsHelper`](/api/backend/update-relations-helper)
  - [Backend - `CRUDControllerHelper`](/backend/crud-controller-helper#list)
