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
            $entities = RelationHelper::fromRelation($model, $relationParams['id'], $relationParams['relation']);
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
            $entities = RelationHelper::notFromRelation($model, $relationParams['id'], $relationParams['relation']);
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
        $params = $request->validated();

        return $this->model->create($params);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FormRequest $request, Model $entity)
    {
        $entity->update($request->validated());

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
