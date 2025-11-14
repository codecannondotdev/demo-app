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
    {
        $entities = $entities instanceof Model ? collect([$entities]) : $entities;

        if ($entities->isEmpty()) {
            return;
        }

        $firstEntity = $entities->first();
        if (! method_exists($firstEntity, $relation)) {
            throw new InvalidArgumentException("The {$relation} relation does not exist on ".get_class($firstEntity));
        }

        $relationInstance = $firstEntity->{$relation}();

        if (! $relationInstance instanceof HasMany) {
            throw new InvalidArgumentException("The {$relation} relation is not a HasMany relation");
        }

        $relatedModel = $relationInstance->getRelated();
        $foreignKeyName = $relationInstance->getForeignKeyName();

        // Get all unassigned related models
        $unassigned = $relatedModel::whereNull($foreignKeyName)
            ->orWhere($foreignKeyName, 0)
            ->get()
            ->shuffle();

        foreach ($entities as $entity) {
            $count = min(rand(1, 3), $unassigned->count());
            if ($count <= 0) {
                break;
            }

            $related = $unassigned->take($count);
            $unassigned = $unassigned->skip($count);

            foreach ($related as $relatedModelInstance) {
                $entity->{$relation}()->save($relatedModelInstance);
            }
        }
    }

    /**
     * Seed hasOne relations by attaching existing unassigned related models to entities.
     *
     * @param  Collection<int, Model>|SupportCollection<int, Model>|Model  $entities  Collection of entities or single entity to attach relations to
     * @param  string  $relation  Relation name on the entity model
     */
    public static function seedHasOne(Collection|SupportCollection|Model $entities, string $relation): void
    {
        $entities = $entities instanceof Model ? collect([$entities]) : $entities;

        if ($entities->isEmpty()) {
            return;
        }

        $firstEntity = $entities->first();
        if (! method_exists($firstEntity, $relation)) {
            throw new InvalidArgumentException("The {$relation} relation does not exist on ".get_class($firstEntity));
        }

        $relationInstance = $firstEntity->{$relation}();

        if (! $relationInstance instanceof HasOne) {
            throw new InvalidArgumentException("The {$relation} relation is not a HasOne relation");
        }

        $relatedModel = $relationInstance->getRelated();
        $foreignKeyName = $relationInstance->getForeignKeyName();

        // Get all unassigned related models
        $unassigned = $relatedModel::whereNull($foreignKeyName)
            ->orWhere($foreignKeyName, 0)
            ->get()
            ->shuffle();

        foreach ($entities as $entity) {
            // Only attach if entity doesn't already have this relation
            if (! $entity->{$relation} && $unassigned->isNotEmpty()) {
                $entity->{$relation}()->save($unassigned->shift());
            } elseif ($unassigned->isEmpty()) {
                break;
            }
        }
    }

    /**
     * Seed belongsTo relations by associating entities with existing parent models.
     *
     * @param  Collection<int, Model>|SupportCollection<int, Model>|Model  $entities  Collection of entities or single entity to associate with parents
     * @param  string  $relation  BelongsTo relation name on the entity model
     */
    public static function seedBelongsTo(Collection|SupportCollection|Model $entities, string $relation): void
    {
        $entities = $entities instanceof Model ? collect([$entities]) : $entities;

        if ($entities->isEmpty()) {
            return;
        }

        $firstEntity = $entities->first();
        if (! method_exists($firstEntity, $relation)) {
            throw new InvalidArgumentException("The {$relation} relation does not exist on ".get_class($firstEntity));
        }

        $relationInstance = $firstEntity->{$relation}();

        if (! $relationInstance instanceof BelongsTo) {
            throw new InvalidArgumentException("The {$relation} relation is not a BelongsTo relation");
        }

        $parentModel = $relationInstance->getRelated();
        $parentModels = $parentModel::all()->shuffle();
        $entities = $entities->shuffle();

        foreach ($parentModels as $parentModelInstance) {
            $count = min(rand(1, 3), $entities->count());
            if ($count <= 0) {
                break;
            }

            $related = $entities->take($count);
            $entities = $entities->skip($count);

            foreach ($related as $entity) {
                $entity->{$relation}()->associate($parentModelInstance)->save();
            }
        }
    }

    /**
     * Seed belongsTo relations for hasOne inverse (ensures 1:1 constraint).
     * Only associates entities with parent models that don't already have the relation.
     *
     * @param  Collection<int, Model>|SupportCollection<int, Model>|Model  $entities  Collection of entities or single entity to associate with parents
     * @param  string  $relation  BelongsTo relation name on the entity model
     * @param  string  $parentRelationName  The hasOne relation name on the parent model
     */
    public static function seedBelongsToOne(Collection|SupportCollection|Model $entities, string $relation, string $parentRelationName): void
    {
        $entities = $entities instanceof Model ? collect([$entities]) : $entities;

        if ($entities->isEmpty()) {
            return;
        }

        $firstEntity = $entities->first();
        if (! method_exists($firstEntity, $relation)) {
            throw new InvalidArgumentException("The {$relation} relation does not exist on ".get_class($firstEntity));
        }

        $relationInstance = $firstEntity->{$relation}();

        if (! $relationInstance instanceof BelongsTo) {
            throw new InvalidArgumentException("The {$relation} relation is not a BelongsTo relation");
        }

        $parentModel = $relationInstance->getRelated();

        // Get parent models that don't already have this relation
        $parentModels = $parentModel::whereDoesntHave($parentRelationName)->get()->shuffle();
        $entities = $entities->shuffle();

        foreach ($parentModels as $parentModelInstance) {
            if ($entities->isNotEmpty()) {
                $entity = $entities->shift();
                $entity->{$relation}()->associate($parentModelInstance)->save();
            } else {
                break;
            }
        }
    }

    /**
     * Seed belongsToMany relations by attaching existing related models to entities.
     *
     * @param  Collection<int, Model>|SupportCollection<int, Model>|Model  $entities  Collection of entities or single entity to attach relations to
     * @param  string  $relation  Relation name on the entity model
     */
    public static function seedBelongsToMany(Collection|SupportCollection|Model $entities, string $relation): void
    {
        $entities = $entities instanceof Model ? collect([$entities]) : $entities;

        if ($entities->isEmpty()) {
            return;
        }

        $firstEntity = $entities->first();
        if (! method_exists($firstEntity, $relation)) {
            throw new InvalidArgumentException("The {$relation} relation does not exist on ".get_class($firstEntity));
        }

        $relationInstance = $firstEntity->{$relation}();

        if (! $relationInstance instanceof BelongsToMany) {
            throw new InvalidArgumentException("The {$relation} relation is not a BelongsToMany relation");
        }

        $relatedModel = $relationInstance->getRelated();
        $allRelatedModels = $relatedModel::all()->shuffle();

        foreach ($entities as $entity) {
            $count = min(rand(1, 8), $allRelatedModels->count());
            if ($count <= 0) {
                continue;
            }

            $ids = $allRelatedModels->take($count)->pluck('id')->toArray();
            $entity->{$relation}()->attach($ids);
        }
    }
}
