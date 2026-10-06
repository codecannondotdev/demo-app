<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use InvalidArgumentException;

/**
 * @template TModel of Model
 * @template TRelated of Model
 */
class RelationHelper
{
    /**
     * @param  TModel|class-string<TModel>  $model  Model we're using for the source relation
     * @param  string|int  $modelId  `id` of the Model we're using for the source
     * @param  string  $relation  Method name on TModel that returns Relation<TRelated>
     * @param  TRelated|class-string<TRelated>  $relatedModel  Model type we want to return
     * @return Builder<TRelated> Builder for models related to the given model via the provided relation.
     */
    public static function fromRelation(Model|string $model, string|int $modelId, string $relation, Model|string $relatedModel): Builder
    {
        if (! $model instanceof Model) {
            $model = new $model;
        }

        $modelInstance = $model->query()->findOrFail($modelId);

        if (! method_exists($modelInstance, $relation)) {
            throw new InvalidArgumentException(sprintf(
                'The %s method doesn\'t exist on %s',
                $relation,
                $model::class
            ));
        }

        $relationInstance = $modelInstance->$relation();

        if (! $relationInstance instanceof Relation) {
            throw new InvalidArgumentException(sprintf(
                'The %s model function must return an instance of %s but %s was returned',
                $relation,
                Relation::class,
                $relationInstance
            ));
        }

        $related = $relationInstance->getRelated();

        if (! $related instanceof $relatedModel) {
            throw new InvalidArgumentException(sprintf(
                'The %s relation must return instances of %s, but %s was returned.',
                $relation,
                $relatedModel,
                $related::class
            ));
        }

        /** @var Relation<TRelated, TModel, mixed> $relationInstance */
        return $relationInstance->getQuery();
    }

    /**
     * @param  TModel|class-string<TModel>  $model  Model we're using for the source relation
     * @param  string|int  $modelId  `id` of the Model we're using for the source
     * @param  string  $relation  Method name on TModel that returns Relation<TRelated>
     * @param  TRelated|class-string<TRelated>  $relatedModel  Model type we want to return
     * @return Builder<TRelated> Builder for models not related to the given model via the provided relation.
     */
    public static function notFromRelation(Model|string $model, string|int $modelId, string $relation, Model|string $relatedModel): Builder
    {
        if (! $model instanceof Model) {
            $model = new $model;
        }

        $modelInstance = $model->query()->findOrFail($modelId);

        if (! method_exists($modelInstance, $relation)) {
            throw new InvalidArgumentException(sprintf(
                'The %s method doesn\'t exist on %s',
                $relation,
                $model::class
            ));
        }

        $relationInstance = $modelInstance->$relation();

        if (! $relationInstance instanceof Relation) {
            throw new InvalidArgumentException(sprintf(
                'The %s model function must return an instance of %s but %s was returned',
                $relation,
                Relation::class,
                $relationInstance
            ));
        }

        $related = $relationInstance->getRelated();

        if (! $related instanceof $relatedModel) {
            throw new InvalidArgumentException(sprintf(
                'The %s relation must return instances of %s, but %s was returned.',
                $relation,
                $relatedModel,
                $related::class
            ));
        }

        return $related->query()->whereNotIn(
            $related->getQualifiedKeyName(),
            $relationInstance->select($related->getQualifiedKeyName())
        );
    }
}
