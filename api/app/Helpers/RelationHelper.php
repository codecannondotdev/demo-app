<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class RelationHelper
{
    public static function fromRelation(Model $model, string|int $modelId, string $relation): Builder
    {
        $modelInstance = $model->findOrFail($modelId);

        return $modelInstance->$relation()->getQuery();
    }

    public static function notFromRelation(Model $model, string|int $modelId, string $relation): Builder
    {
        $modelInstance = $model->findOrFail($modelId);
        $modelInstance->$relation()->get()->pluck('id')->toArray();

        return $modelInstance->$relation()->getRelated()->whereNotIn('id', $modelInstance->$relation()->get()->pluck('id')->toArray());
    }
}
