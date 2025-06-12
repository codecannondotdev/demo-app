<?php

use App\Helpers\UpdateRelationsHelper;
use Tests\Models\TestModelA;
use Tests\Models\TestModelB;

test('should throw if relation does not exist', function () {
    expect(fn () => UpdateRelationsHelper::updateRelation(new TestModelA, 'someRelation', 'someMethod', [1])
    )->toThrow(InvalidArgumentException::class, 'The someRelation relation does not exist on Tests\Models\TestModelA');
});

test('should throw if params not integer or string', function () {
    expect(fn () => UpdateRelationsHelper::updateRelation(new TestModelA, 'testModelBBelongsTo', 'someMethod', [[]])
    )->toThrow(InvalidArgumentException::class, 'The params must be ids (integer or string)');
});

test('should throw if unsuppored method is used', function () {
    expect(fn () => UpdateRelationsHelper::updateRelation(new TestModelA, 'testModelBBelongsTo', 'someMethod', [1])
    )->toThrow(InvalidArgumentException::class, 'The someMethod method is not supported. Suppored methods are associate, dissociate, attach, detach, sync, toggle, syncWithoutDetaching');
});

/*
 * Associate method tests
 */
test('should throw if associate method is called on unsuppored relation', function () {
    expect(fn () => UpdateRelationsHelper::updateRelation(new TestModelA, 'testModelBBelongsToMany', 'associate', [1])
    )->toThrow(InvalidArgumentException::class, 'The associate method is not supported for Illuminate\Database\Eloquent\Relations\BelongsToMany relation');
});

test('should associate a model via a BelongsTo relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBBelongsTo', 'associate', [$modelB->id]);

    expect($modelA->testModelBBelongsTo->id)->toBe($modelB->id);
    expect($modelB->testModelAHasOne->id)->toBe($modelA->id);
});

test('should throw if attempting to associate multiple models via a BelongsTo relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    $modelC = new TestModelB;
    $modelC->save();

    expect(fn () => UpdateRelationsHelper::updateRelation($modelA, 'testModelBBelongsTo', 'associate', [$modelB->id, $modelC->id])
    )->toThrow(InvalidArgumentException::class, 'The associate method only supports one id for BelongsTo relation');
});

test('should associate a model via a HasOne relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBHasOne', 'associate', [$modelB->id]);

    $modelA->refresh();
    $modelB->refresh();

    expect($modelA->testModelBHasOne->id)->toBe($modelB->id);
    expect($modelB->testModelABelongsTo->id)->toBe($modelA->id);
});

test('should dissociate first when associating a HasOne relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBHasOne', 'associate', [$modelB->id]);

    $modelA->refresh();
    $modelB->refresh();

    expect($modelA->testModelBHasOne->id)->toBe($modelB->id);
    expect($modelB->testModelABelongsTo->id)->toBe($modelA->id);

    $modelC = new TestModelB;
    $modelC->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBHasOne', 'associate', [$modelC->id]);

    $modelA->refresh();
    $modelB->refresh();
    $modelC->refresh();

    expect($modelA->testModelBHasOne->id)->toBe($modelC->id);
    expect($modelB->testModelABelongsTo)->toBe(null);
    expect($modelC->testModelABelongsTo->id)->toBe($modelA->id);
});

test('should throw if attempting to associate multiple models via a HasOne relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    $modelC = new TestModelB;
    $modelC->save();

    expect(fn () => UpdateRelationsHelper::updateRelation($modelA, 'testModelBHasOne', 'associate', [$modelB->id, $modelC->id])
    )->toThrow(InvalidArgumentException::class, 'The associate method only supports one id for HasOne relation');
});

test('should associate a model via a HasMany relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBHasMany', 'associate', [$modelB->id]);

    $modelB->refresh();

    expect($modelA->testModelBHasMany->first()->id)->toBe($modelB->id);
    expect($modelB->testModelABelongsTo->id)->toBe($modelA->id);
});

test('should associate multiple models via a HasMany relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB1 = new TestModelB;
    $modelB1->save();

    $modelB2 = new TestModelB;
    $modelB2->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBHasMany', 'associate', [$modelB1->id, $modelB2->id]);

    $modelB1->refresh();
    $modelB2->refresh();

    expect($modelA->testModelBHasMany->first()->id)->toBe($modelB1->id);
    expect($modelA->testModelBHasMany->last()->id)->toBe($modelB2->id);
    expect($modelB1->testModelABelongsTo->id)->toBe($modelA->id);
    expect($modelB2->testModelABelongsTo->id)->toBe($modelA->id);
});

/*
 * Dissociate method tests
 */

test('should throw if trying to dissociate an unsupported relation type', function () {
    expect(fn () => UpdateRelationsHelper::updateRelation(new TestModelA, 'testModelBBelongsToMany', 'dissociate', [1])
    )->toThrow(InvalidArgumentException::class, 'The dissociate method is not supported for Illuminate\Database\Eloquent\Relations\BelongsToMany relation');
});

test('should dissociate a model via a BelongsTo relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    $modelA->testModelBBelongsTo()->associate($modelB);
    $modelA->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBBelongsTo', 'dissociate', []);

    $modelA->refresh();
    $modelB->refresh();

    expect($modelA->testModelBBelongsTo)->toBeNull();
    expect($modelB->testModelAHasOne)->toBeNull();
});

test('should dissociate a model via a HasOne relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    $modelA->testModelBHasOne()->save($modelB);

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBHasOne', 'dissociate', []);

    $modelA->refresh();
    $modelB->refresh();

    expect($modelA->testModelBHasOne)->toBeNull();
    expect($modelB->testModelABelongsTo)->toBeNull();
});

test('should dissociate a model via a HasMany relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    $modelA->testModelBHasMany()->save($modelB);

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBHasMany', 'dissociate', [$modelB->id]);

    $modelA->refresh();
    $modelB->refresh();

    expect($modelA->testModelBHasMany)->toBeEmpty();
    expect($modelB->testModelABelongsTo)->toBeNull();
});

test('should dissociate multiple models via a HasMany relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB1 = new TestModelB;
    $modelB1->save();

    $modelB2 = new TestModelB;
    $modelB2->save();

    $modelA->testModelBHasMany()->saveMany([$modelB1, $modelB2]);

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBHasMany', 'dissociate', [$modelB1->id, $modelB2->id]);

    $modelA->refresh();
    $modelB1->refresh();
    $modelB2->refresh();

    expect($modelA->testModelBHasMany)->toBeEmpty();
    expect($modelB1->testModelABelongsTo)->toBeNull();
    expect($modelB2->testModelABelongsTo)->toBeNull();
});

/*
 * Attach method tests
 */
test('should throw if attach method is called on unsuppored relation', function () {
    expect(fn () => UpdateRelationsHelper::updateRelation(new TestModelA, 'testModelBBelongsTo', 'attach', [1])
    )->toThrow(InvalidArgumentException::class, 'The attach method is not supported for Illuminate\Database\Eloquent\Relations\BelongsTo relation');
});

test('should attach a model via a BelongsToMany relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBBelongsToMany', 'attach', [$modelB->id]);

    $modelA->refresh();
    $modelB->refresh();

    expect($modelA->testModelBBelongsToMany->first()->id)->toBe($modelB->id);
    expect($modelB->testModelABelongsToMany->first()->id)->toBe($modelA->id);
});

/*
 * Detach method tests
 */
test('should throw if trying to detach an unsupported relation type', function () {
    expect(fn () => UpdateRelationsHelper::updateRelation(new TestModelA, 'testModelBBelongsTo', 'detach', [1])
    )->toThrow(InvalidArgumentException::class, 'The detach method is not supported for Illuminate\Database\Eloquent\Relations\BelongsTo relation');
});

test('should detach a model via a BelongsToMany relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    $modelA->testModelBBelongsToMany()->attach($modelB);
    $modelA->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBBelongsToMany', 'detach', [$modelB->id]);

    $modelA->refresh();
    $modelB->refresh();

    expect($modelA->testModelBBelongsToMany)->toBeEmpty();
    expect($modelB->testModelABelongsToMany)->toBeEmpty();
});

/*
 * Sync method tests
 */
test('should throw if sync method is called on unsuppored relation', function () {
    expect(fn () => UpdateRelationsHelper::updateRelation(new TestModelA, 'testModelBBelongsTo', 'sync', [1])
    )->toThrow(InvalidArgumentException::class, 'The sync method is not supported for Illuminate\Database\Eloquent\Relations\BelongsTo relation');
});

test('should sync a model via a BelongsToMany relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB1 = new TestModelB;
    $modelB1->save();

    $modelB2 = new TestModelB;
    $modelB2->save();

    $modelA->testModelBBelongsToMany()->attach($modelB1);
    $modelA->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBBelongsToMany', 'sync', [$modelB2->id]);

    $modelA->refresh();
    $modelB1->refresh();
    $modelB2->refresh();

    expect($modelA->testModelBBelongsToMany->first()->id)->toBe($modelB2->id);
    expect($modelB1->testModelABelongsToMany)->toBeEmpty();
    expect($modelB2->testModelABelongsToMany->first()->id)->toBe($modelA->id);
});

/*
 * Toggle method tests
 */
test('should throw if toggle method is called on unsuppored relation', function () {
    expect(fn () => UpdateRelationsHelper::updateRelation(new TestModelA, 'testModelBBelongsTo', 'toggle', [1])
    )->toThrow(InvalidArgumentException::class, 'The toggle method is not supported for Illuminate\Database\Eloquent\Relations\BelongsTo relation');
});

test('should toggle a model via a BelongsToMany relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB = new TestModelB;
    $modelB->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBBelongsToMany', 'toggle', [$modelB->id]);

    $modelA->refresh();
    $modelB->refresh();

    expect($modelA->testModelBBelongsToMany->first()->id)->toBe($modelB->id);
    expect($modelB->testModelABelongsToMany->first()->id)->toBe($modelA->id);

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBBelongsToMany', 'toggle', [$modelB->id]);

    $modelA->refresh();
    $modelB->refresh();

    expect($modelA->testModelBBelongsToMany)->toBeEmpty();
    expect($modelB->testModelABelongsToMany)->toBeEmpty();
});

/*
 * SyncWithoutDetaching method tests
 */
test('should throw if syncWithoutDetaching method is called on unsuppored relation', function () {
    expect(fn () => UpdateRelationsHelper::updateRelation(new TestModelA, 'testModelBBelongsTo', 'syncWithoutDetaching', [1])
    )->toThrow(InvalidArgumentException::class, 'The syncWithoutDetaching method is not supported for Illuminate\Database\Eloquent\Relations\BelongsTo relation');
});

test('should syncWithoutDetaching a model via a BelongsToMany relation', function () {
    $modelA = new TestModelA;
    $modelA->save();

    $modelB1 = new TestModelB;
    $modelB1->save();

    $modelB2 = new TestModelB;
    $modelB2->save();

    $modelA->testModelBBelongsToMany()->attach($modelB1);
    $modelA->save();

    UpdateRelationsHelper::updateRelation($modelA, 'testModelBBelongsToMany', 'syncWithoutDetaching', [$modelB2->id]);

    $modelA->refresh();
    $modelB1->refresh();
    $modelB2->refresh();

    expect($modelA->testModelBBelongsToMany->first()->id)->toBe($modelB1->id);
    expect($modelA->testModelBBelongsToMany->last()->id)->toBe($modelB2->id);
    expect($modelB1->testModelABelongsToMany->first()->id)->toBe($modelA->id);
    expect($modelB2->testModelABelongsToMany->first()->id)->toBe($modelA->id);
});
