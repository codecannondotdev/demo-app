---
outline: 'deep'
---

# `CrudControllerHelper`

The `CrudControllerHelper` is a helper class that is used to create a controller
for a model. It provides a set of methods that can be used to create a CRUD
controller for a model.

## Class

```php
<?php

namespace App\Http\Controllers;

use App\Helpers\FilterHelper;
use App\Helpers\RelationHelper;
use App\Helpers\UpdateRelationsHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class CRUDControllerHelper extends Controller
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

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

    /**
     * Store a newly created resource in storage.
     */
    public function store(FormRequest $request)
    {
        $params = $request->input();

        return $this->model->create($params);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FormRequest $request, Model $entity)
    {
        $entity->update($request->input());

        return $entity;
    }

    /**
     * Update the specified resource relations in storage.
     */
    public function updateRelation(Request $request, Model $entity, string $relation)
    {
        UpdateRelationsHelper::updateRelation($entity, $relation, $request->input('method'), $request->input('params', []));

        return $entity->load($relation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Model $entity)
    {
        $entity->delete();
    }
}
```


## Properties

For precise parameter documentation you can view [API - Api](/api/frontend/api).

### `protected $model`

- **Type**: `Model`
- **Required**: `true`
- **Description**: The model that the controller is managing.

## Methods

### `list`

- **Type**: `(Request $request) => LengthAwarePaginator<Model>`
- **Description**: Display a paginated list of resources.

### `show`

- **Type**: `(Model $entity) => Model`
- **Description**: Display the specified resource.

#### `$request['with']`

- **Type**: `string[]`
- **Description**: The relations to load with the entity.

### `store`

- **Type**: `(FormRequest $request) => Model`
- **Description**: Store a newly created resource in storage.

### `update`

- **Type**: `(FormRequest $request, Model $entity) => Model`
- **Description**: Update the specified resource in storage.

### `updateRelation`

- **Type**: `(Request $request, Model $entity, string $relation) => Model`
- **Description**: Update the specified resource relations in storage.

### `destroy`

- **Type**: `(Model $entity) => void`
- **Description**: Remove the specified resource from storage.
