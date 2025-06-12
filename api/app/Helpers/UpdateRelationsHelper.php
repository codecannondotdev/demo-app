<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UpdateRelationsHelper
{
    public static function updateRelation(Model $model, string $relation, string $method, array $params)
    {
        // Ensure relation exists on model
        if (! method_exists($model, $relation)) {
            throw new \InvalidArgumentException("The $relation relation does not exist on ".get_class($model));
        }

        // Ensure params are either integers or strings
        foreach ($params as $param) {
            if (! is_int($param) && ! is_string($param)) {
                throw new \InvalidArgumentException('The params must be ids (integer or string)');
            }
        }

        switch ($method) {
            case 'associate':
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
                break;

            case 'dissociate':
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

                break;

            case 'attach':
                // Ensure relation is BelongsToMany
                if (! $model->{$relation}() instanceof BelongsToMany) {
                    throw new \InvalidArgumentException('The attach method is not supported for '.get_class($model->{$relation}()).' relation');
                }

                // Attach method for BelongsToMany relation
                $model->{$relation}()->$method($params);
                break;

            case 'detach':
                // Ensure relation is BelongsToMany
                if (! $model->{$relation}() instanceof BelongsToMany) {
                    throw new \InvalidArgumentException('The detach method is not supported for '.get_class($model->{$relation}()).' relation');
                }

                // Detach method for BelongsToMany relation
                $model->{$relation}()->$method($params);
                break;

            case 'sync':
                // Ensure relation is BelongsToMany
                if (! $model->{$relation}() instanceof BelongsToMany) {
                    throw new \InvalidArgumentException('The sync method is not supported for '.get_class($model->{$relation}()).' relation');
                }

                // Sync method for BelongsToMany relation
                $model->{$relation}()->$method($params);
                break;

            case 'toggle':
                // Ensure relation is BelongsToMany
                if (! $model->{$relation}() instanceof BelongsToMany) {
                    throw new \InvalidArgumentException('The toggle method is not supported for '.get_class($model->{$relation}()).' relation');
                }

                // Toggle method for BelongsToMany relation
                $model->{$relation}()->$method($params);
                break;

            case 'syncWithoutDetaching':
                // Ensure relation is BelongsToMany
                if (! $model->{$relation}() instanceof BelongsToMany) {
                    throw new \InvalidArgumentException('The syncWithoutDetaching method is not supported for '.get_class($model->{$relation}()).' relation');
                }

                // SyncWithoutDetaching method for BelongsToMany relation
                $model->{$relation}()->$method($params);
                break;
            default:
                throw new \InvalidArgumentException("The $method method is not supported. Suppored methods are associate, dissociate, attach, detach, sync, toggle, syncWithoutDetaching");
        }
    }
}
