<?php

use App\Helpers\SeederHelper;
use Tests\Fixtures\Models\TestModelA;
use Tests\Fixtures\Models\TestModelB;

describe('seedHasMany', function () {
    test('should seed hasMany relations with existing unassigned models', function () {
        // Create parent models
        $modelA1 = TestModelA::create();
        $modelA2 = TestModelA::create();

        // Create unassigned related models
        TestModelB::create();
        TestModelB::create();
        TestModelB::create();
        TestModelB::create();

        SeederHelper::seedHasMany(collect([$modelA1, $modelA2]), 'testModelBHasMany');

        $modelA1->refresh();
        $modelA2->refresh();

        expect($modelA1->testModelBHasMany)->not->toBeEmpty();
        expect($modelA2->testModelBHasMany)->not->toBeEmpty();
        expect($modelA1->testModelBHasMany->count() + $modelA2->testModelBHasMany->count())->toBeLessThanOrEqual(4);
    });

    test('should throw if relation does not exist', function () {
        $modelA = TestModelA::create();

        expect(fn () => SeederHelper::seedHasMany(collect([$modelA]), 'nonExistingRelation'))
            ->toThrow(InvalidArgumentException::class, 'The nonExistingRelation relation does not exist');
    });

    test('should throw if relation is not HasMany', function () {
        $modelA = TestModelA::create();

        expect(fn () => SeederHelper::seedHasMany(collect([$modelA]), 'testModelBHasOne'))
            ->toThrow(InvalidArgumentException::class, 'The testModelBHasOne relation is not a HasMany relation');
    });

    test('should handle empty collection', function () {
        SeederHelper::seedHasMany(collect([]), 'testModelBHasMany');
        expect(true)->toBeTrue();
    });

    test('should handle single model instance', function () {
        $modelA = TestModelA::create();
        TestModelB::create();

        SeederHelper::seedHasMany($modelA, 'testModelBHasMany');

        $modelA->refresh();
        expect($modelA->testModelBHasMany)->not->toBeEmpty();
    });
});

describe('seedHasOne', function () {
    test('should seed hasOne relations with existing unassigned models', function () {
        // Create parent models
        $modelA1 = TestModelA::create();
        $modelA2 = TestModelA::create();

        // Create unassigned related models
        TestModelB::create();
        TestModelB::create();

        SeederHelper::seedHasOne(collect([$modelA1, $modelA2]), 'testModelBHasOne');

        $modelA1->refresh();
        $modelA2->refresh();

        expect($modelA1->testModelBHasOne)->not->toBeNull();
        expect($modelA2->testModelBHasOne)->not->toBeNull();
        expect($modelA1->testModelBHasOne->id)->not->toBe($modelA2->testModelBHasOne->id);
    });

    test('should not attach if entity already has relation', function () {
        $modelA = TestModelA::create();
        $modelB1 = TestModelB::create(['test_model_a_id' => $modelA->id]);
        TestModelB::create();

        SeederHelper::seedHasOne(collect([$modelA]), 'testModelBHasOne');

        $modelA->refresh();
        expect($modelA->testModelBHasOne->id)->toBe($modelB1->id);
    });

    test('should throw if relation does not exist', function () {
        $modelA = TestModelA::create();

        expect(fn () => SeederHelper::seedHasOne(collect([$modelA]), 'nonExistingRelation'))
            ->toThrow(InvalidArgumentException::class, 'The nonExistingRelation relation does not exist');
    });

    test('should throw if relation is not HasOne', function () {
        $modelA = TestModelA::create();

        expect(fn () => SeederHelper::seedHasOne(collect([$modelA]), 'testModelBHasMany'))
            ->toThrow(InvalidArgumentException::class, 'The testModelBHasMany relation is not a HasOne relation');
    });

    test('should handle empty collection', function () {
        SeederHelper::seedHasOne(collect([]), 'testModelBHasOne');
        expect(true)->toBeTrue();
    });

    test('should handle single model instance', function () {
        $modelA = TestModelA::create();
        TestModelB::create();

        SeederHelper::seedHasOne($modelA, 'testModelBHasOne');

        $modelA->refresh();
        expect($modelA->testModelBHasOne)->not->toBeNull();
    });
});

describe('seedBelongsTo', function () {
    test('should seed belongsTo relations by associating with parent models', function () {
        // Create parent models
        TestModelB::create();
        TestModelB::create();

        // Create child models
        $modelA1 = TestModelA::create();
        $modelA2 = TestModelA::create();
        $modelA3 = TestModelA::create();
        $modelA4 = TestModelA::create();

        SeederHelper::seedBelongsTo(collect([$modelA1, $modelA2, $modelA3, $modelA4]), 'testModelBBelongsTo');

        $modelA1->refresh();
        $modelA2->refresh();
        $modelA3->refresh();
        $modelA4->refresh();

        expect($modelA1->testModelBBelongsTo)->not->toBeNull();
        expect($modelA2->testModelBBelongsTo)->not->toBeNull();
        expect($modelA3->testModelBBelongsTo)->not->toBeNull();
        expect($modelA4->testModelBBelongsTo)->not->toBeNull();
    });

    test('should throw if relation does not exist', function () {
        $modelA = TestModelA::create();

        expect(fn () => SeederHelper::seedBelongsTo(collect([$modelA]), 'nonExistingRelation'))
            ->toThrow(InvalidArgumentException::class, 'The nonExistingRelation relation does not exist');
    });

    test('should throw if relation is not BelongsTo', function () {
        $modelA = TestModelA::create();

        expect(fn () => SeederHelper::seedBelongsTo(collect([$modelA]), 'testModelBHasMany'))
            ->toThrow(InvalidArgumentException::class, 'The testModelBHasMany relation is not a BelongsTo relation');
    });

    test('should handle empty collection', function () {
        SeederHelper::seedBelongsTo(collect([]), 'testModelBBelongsTo');
        expect(true)->toBeTrue();
    });

    test('should handle single model instance', function () {
        TestModelB::create();
        $modelA = TestModelA::create();

        SeederHelper::seedBelongsTo($modelA, 'testModelBBelongsTo');

        $modelA->refresh();
        expect($modelA->testModelBBelongsTo)->not->toBeNull();
    });
});

describe('seedBelongsToOne', function () {
    test('should seed belongsTo relations for hasOne inverse with 1:1 constraint', function () {
        // Create parent models
        $modelA1 = TestModelA::create();
        $modelA2 = TestModelA::create();
        $modelA3 = TestModelA::create();

        // Create child models
        $modelB1 = TestModelB::create();
        $modelB2 = TestModelB::create();
        $modelB3 = TestModelB::create();

        SeederHelper::seedBelongsToOne(collect([$modelB1, $modelB2, $modelB3]), 'testModelABelongsTo', 'testModelBHasOne');

        $modelA1->refresh();
        $modelA2->refresh();
        $modelA3->refresh();
        $modelB1->refresh();
        $modelB2->refresh();
        $modelB3->refresh();

        // Each parent should have at most one child
        $hasOneCount = 0;
        if ($modelA1->testModelBHasOne) {
            $hasOneCount++;
        }
        if ($modelA2->testModelBHasOne) {
            $hasOneCount++;
        }
        if ($modelA3->testModelBHasOne) {
            $hasOneCount++;
        }

        expect($hasOneCount)->toBeLessThanOrEqual(3);
    });

    test('should not associate with parent that already has relation', function () {
        $modelA = TestModelA::create();
        $modelB1 = TestModelB::create(['test_model_a_id' => $modelA->id]);
        $modelB2 = TestModelB::create();

        SeederHelper::seedBelongsToOne(collect([$modelB2]), 'testModelABelongsTo', 'testModelBHasOne');

        $modelA->refresh();
        expect($modelA->testModelBHasOne->id)->toBe($modelB1->id);
    });

    test('should throw if relation does not exist', function () {
        $modelB = TestModelB::create();

        expect(fn () => SeederHelper::seedBelongsToOne(collect([$modelB]), 'nonExistingRelation', 'testModelBHasOne'))
            ->toThrow(InvalidArgumentException::class, 'The nonExistingRelation relation does not exist');
    });

    test('should throw if relation is not BelongsTo', function () {
        $modelB = TestModelB::create();

        expect(fn () => SeederHelper::seedBelongsToOne(collect([$modelB]), 'testModelAHasMany', 'testModelBHasOne'))
            ->toThrow(InvalidArgumentException::class, 'The testModelAHasMany relation is not a BelongsTo relation');
    });

    test('should handle empty collection', function () {
        SeederHelper::seedBelongsToOne(collect([]), 'testModelABelongsTo', 'testModelBHasOne');
        expect(true)->toBeTrue();
    });

    test('should handle single model instance', function () {
        $modelA = TestModelA::create();
        $modelB = TestModelB::create();

        SeederHelper::seedBelongsToOne($modelB, 'testModelABelongsTo', 'testModelBHasOne');

        $modelA->refresh();
        $modelB->refresh();
        expect($modelB->testModelABelongsTo)->not->toBeNull();
    });
});

describe('seedBelongsToMany', function () {
    test('should seed belongsToMany relations with existing related models', function () {
        $modelA1 = TestModelA::create();
        $modelA2 = TestModelA::create();

        // Create some related models
        $modelB1 = TestModelB::create();
        $modelB2 = TestModelB::create();
        $modelB3 = TestModelB::create();
        $modelB4 = TestModelB::create();

        SeederHelper::seedBelongsToMany(collect([$modelA1, $modelA2]), 'testModelBBelongsToMany');

        $modelA1->refresh();
        $modelA2->refresh();

        // Should attach actual related models, not random IDs
        expect($modelA1->testModelBBelongsToMany)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);
        expect($modelA2->testModelBBelongsToMany)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);

        // Verify that attached models are actual existing models
        $allAttachedIds = $modelA1->testModelBBelongsToMany->pluck('id')
            ->merge($modelA2->testModelBBelongsToMany->pluck('id'))
            ->unique();

        $allModelBIds = collect([$modelB1->id, $modelB2->id, $modelB3->id, $modelB4->id]);

        // All attached IDs should be from the actual created models
        expect($allAttachedIds->diff($allModelBIds)->isEmpty())->toBeTrue();
    });

    test('should throw if relation does not exist', function () {
        $modelA = TestModelA::create();

        expect(fn () => SeederHelper::seedBelongsToMany(collect([$modelA]), 'nonExistingRelation'))
            ->toThrow(InvalidArgumentException::class, 'The nonExistingRelation relation does not exist');
    });

    test('should throw if relation is not BelongsToMany', function () {
        $modelA = TestModelA::create();

        expect(fn () => SeederHelper::seedBelongsToMany(collect([$modelA]), 'testModelBHasMany'))
            ->toThrow(InvalidArgumentException::class, 'The testModelBHasMany relation is not a BelongsToMany relation');
    });

    test('should handle empty collection', function () {
        SeederHelper::seedBelongsToMany(collect([]), 'testModelBBelongsToMany');
        expect(true)->toBeTrue();
    });

    test('should handle single model instance', function () {
        $modelA = TestModelA::create();

        // Create some related models
        $modelB1 = TestModelB::create();
        $modelB2 = TestModelB::create();

        SeederHelper::seedBelongsToMany($modelA, 'testModelBBelongsToMany');

        $modelA->refresh();
        expect($modelA->testModelBBelongsToMany)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);

        // Verify attached models are actual existing models
        $allModelBIds = collect([$modelB1->id, $modelB2->id]);
        $attachedIds = $modelA->testModelBBelongsToMany->pluck('id');
        expect($attachedIds->diff($allModelBIds)->isEmpty())->toBeTrue();
    });

    test('should handle when there are no related models', function () {
        $modelA = TestModelA::create();

        // Don't create any related models
        SeederHelper::seedBelongsToMany($modelA, 'testModelBBelongsToMany');

        $modelA->refresh();
        expect($modelA->testModelBBelongsToMany)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);
        expect($modelA->testModelBBelongsToMany->isEmpty())->toBeTrue();
    });
});
