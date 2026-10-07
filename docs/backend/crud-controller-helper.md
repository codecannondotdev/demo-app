---
outline: 'deep'
---

# `CRUDControllerHelper`

The `CRUDControllerHelper` is used in CRUD controllers to provide default request
handlers for the list, show, store, update, updateRelation and destroy routes.

It can be found in the `App\Http\Controllers\Helpers` namespace.

- See also
  - [Backend - CRUD Controllers](/backend/crud-controllers)

## Usage

To use the `CRUDControllerHelper` in a CRUD controller, you can create a new instance
of the helper in the constructor and pass the model to it.

```php
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    protected $crudControllerHelper;

    public function __construct()
    {
        $this->crudControllerHelper = new CRUDControllerHelper(User::class);
    }

    /**
     * Display a listing of the resource.
     */
    public function list(Request $request)
    {
        return $this->crudControllerHelper->list($request);
    }
}
```

- See also
  - [Backend - CRUD Controllers](/backend/crud-controllers)

## `list`

The list route contains some of the most powerful features of the CRUD controllers.
It allows you to filter, sort, paginate and append relations to the list of entities

This is the default list handler:

```php
<?php

/**
 * Display a listing of the resource.
 */
public function list(Request $request)
{
    $entities = $this->model->query();

    if (! is_null(request('fromRelation'))) {
        if (! is_array(request('fromRelation'))) {
            abort(400, 'Invalid fromRelation format');
        }
        $relationParams = request('fromRelation');
        if (! class_exists($relationParams['model'])) {
            abort(400, 'Invalid model');
        }
        if (! isset($relationParams['id'])) {
            abort(400, 'Invalid id');
        }
        $model = new $relationParams['model'];
            $entities = RelationHelper::fromRelation(
                $model,
                $relationParams['id'],
                $relationParams['relation'],
                $this->model
            );
    }

    if (! is_null(request('notFromRelation'))) {
        if (! is_null(request('fromRelation'))) {
            abort(400, 'fromRelation and notFromRelation cannot be used together');
        }
        if (! is_array(request('notFromRelation'))) {
            abort(400, 'Invalid notFromRelation format');
        }
        $relationParams = request('notFromRelation');
        if (! class_exists($relationParams['model'])) {
            abort(400, 'Invalid model');
        }
        if (! isset($relationParams['id'])) {
            abort(400, 'Invalid id');
        }
        $model = new $relationParams['model'];
            $entities = RelationHelper::notFromRelation(
                $model,
                $relationParams['id'],
                $relationParams['relation'],
                $this->model
            );
    }

    if (! is_null(request('search'))) {
        $entities = $this->model->search(request('search'));
    }

    if (! is_null(request('filters'))) {
        FilterHelper::applyFilters($entities, request('filters'));
    }

    if (! is_null(request('orderBy'))) {
        if (request('order') !== 'asc' && request('order') !== 'desc') {
            abort(400, 'Invalid order');
        }
        $entities->orderBy(request('orderBy'), request('order', 'asc'));
    }

    if (! is_null(request('with'))) {
        $entities->with(request('with'));
    }

    return $entities->paginate($request->input('per_page', 25));
}
```

- See also
  - [API - `list`](/api/backend/crud-controller-helper#list)
  - [API - `RelationHelper`](/api/backend/relation-helper)
  - [API - `FilterHelper`](/api/backend/filter-helper)

## `show`

The show route allows you to fetch a single entity by its ID and append relations
to it.

This is the default show handler:

```php
<?php

/**
 * Display the specified resource.
 */
public function show(Model $entity)
{
    if (! is_null(request('with'))) {
        $entity->load(request('with'));
    }

    return $entity;
}
```

- See also
  - [API - `show`](/api/backend/crud-controller-helper#show)

## `store`

The store route allows you to create a new entity in the database.

This is the default store handler:

```php
<?php

/**
 * Store a newly created resource in storage.
 */
public function store(FormRequest $request)
{
    $params = $request->input();

    return $this->model->create($params);
}
```

## `update`

The update route allows you to update an existing entity in the database.

This is the default update handler:

```php
<?php

/**
 * Update the specified resource in storage.
 */
public function update(FormRequest $request, Model $entity)
{
    $entity->update($request->input());

    return $entity;
}
```

## `updateRelation`

The updateRelation route allows you to update a relation of an entity in the database.

This is the default updateRelation handler:

```php
<?php

/**
 * Update the specified resource relations in storage.
 */
public function updateRelation(Request $request, Model $entity, string $relation)
{
    UpdateRelationsHelper::updateRelation($entity, $relation, $request->input('method'), $request->input('params', []));

    return $entity->load($relation);
}
```

## `destroy`

The destroy route allows you to delete an entity from the database.

This is the default destroy handler:

```php
<?php

/**
 * Remove the specified resource from storage.
 */
public function destroy(Model $entity)
{
    $entity->delete();
}
```
