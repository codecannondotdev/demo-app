<?php

use App\Helpers\RelationHelper;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Tests\Fixtures\Models\TestModelA;
use Tests\Fixtures\Models\TestModelB;

if (! class_exists('TestModelAWithInvalidRelation')) {
    class TestModelAWithInvalidRelation extends TestModelA
    {
        public function notARelation(): string
        {
            return 'not relation';
        }
    }
}

describe('fromRelation', function () {
    test('returns a builder for the given relation', function () {
        $modelA = new TestModelA;
        $modelA->save();

        $related = TestModelB::create(['test_model_a_id' => $modelA->id]);

        $builder = RelationHelper::fromRelation(new TestModelA, $modelA->id, 'testModelBHasMany', new TestModelB);

        expect($builder)->toBeInstanceOf(Builder::class);

        $ids = $builder->pluck('id')->all();

        expect($ids)->toContain($related->id);
    });

    test('throws when the model cannot be found', function () {
        expect(fn () => RelationHelper::fromRelation(new TestModelA, 9999, 'testModelBHasMany', TestModelB::class))
            ->toThrow(ModelNotFoundException::class);
    });

    test('throws when the relation method does not exist', function () {
        $modelA = new TestModelA;
        $modelA->save();

        expect(fn () => RelationHelper::fromRelation(new TestModelA, $modelA->id, 'nonExistingRelation', TestModelB::class))
            ->toThrow(InvalidArgumentException::class, 'The nonExistingRelation method doesn\'t exist on Tests\\Fixtures\\Models\\TestModelA');
    });

    test('throws when the relation does not return a Relation instance', function () {
        $model = new TestModelAWithInvalidRelation;
        $model->save();

        expect(fn () => RelationHelper::fromRelation($model, $model->id, 'notARelation', TestModelB::class))
            ->toThrow(InvalidArgumentException::class, 'The notARelation model function must return an instance of Illuminate\\Database\\Eloquent\\Relations\\Relation but not relation was returned');
    });

    test('throws when relation model does not match expected class', function () {
        $modelA = new TestModelA;
        $modelA->save();

        TestModelB::create(['test_model_a_id' => $modelA->id]);

        expect(fn () => RelationHelper::fromRelation(new TestModelA, $modelA->id, 'testModelBHasMany', TestModelA::class))
            ->toThrow(InvalidArgumentException::class, 'The testModelBHasMany relation must return instances of Tests\\Fixtures\\Models\\TestModelA, but Tests\\Fixtures\\Models\\TestModelB was returned.');
    });

    test('supports class-string model and class-string related model', function () {
        $modelA = new TestModelA;
        $modelA->save();

        $related = TestModelB::create(['test_model_a_id' => $modelA->id]);

        $builder = RelationHelper::fromRelation(TestModelA::class, $modelA->id, 'testModelBHasMany', TestModelB::class);

        expect($builder->pluck('id')->all())->toContain($related->id);
    });

    test('supports class-string model and instance related model', function () {
        $modelA = new TestModelA;
        $modelA->save();

        $related = TestModelB::create(['test_model_a_id' => $modelA->id]);

        $builder = RelationHelper::fromRelation(TestModelA::class, $modelA->id, 'testModelBHasMany', new TestModelB);

        expect($builder->pluck('id')->all())->toContain($related->id);
    });

    test('supports instance model and class-string related model', function () {
        $modelA = new TestModelA;
        $modelA->save();

        $related = TestModelB::create(['test_model_a_id' => $modelA->id]);

        $builder = RelationHelper::fromRelation(new TestModelA, $modelA->id, 'testModelBHasMany', TestModelB::class);

        expect($builder->pluck('id')->all())->toContain($related->id);
    });
});

describe('notFromRelation', function () {
    test('returns a builder excluding related models', function () {
        $modelA = new TestModelA;
        $modelA->save();

        $related = TestModelB::create(['test_model_a_id' => $modelA->id]);
        $unrelated = TestModelB::create();

        $builder = RelationHelper::notFromRelation(new TestModelA, $modelA->id, 'testModelBHasMany', TestModelB::class);

        expect($builder)->toBeInstanceOf(Builder::class);

        $ids = $builder->pluck('id')->all();

        expect($ids)->not->toContain($related->id);
        expect($ids)->toContain($unrelated->id);
    });

    test('throws when the relation method does not exist', function () {
        $modelA = new TestModelA;
        $modelA->save();

        expect(fn () => RelationHelper::notFromRelation(new TestModelA, $modelA->id, 'nonExistingRelation', TestModelB::class))
            ->toThrow(InvalidArgumentException::class, 'The nonExistingRelation method doesn\'t exist on Tests\\Fixtures\\Models\\TestModelA');
    });

    test('throws when the relation does not return a Relation instance', function () {
        $model = new TestModelAWithInvalidRelation;
        $model->save();

        expect(fn () => RelationHelper::notFromRelation($model, $model->id, 'notARelation', TestModelB::class))
            ->toThrow(InvalidArgumentException::class, 'The notARelation model function must return an instance of Illuminate\\Database\\Eloquent\\Relations\\Relation but not relation was returned');
    });

    test('throws when relation model does not match expected class', function () {
        $modelA = new TestModelA;
        $modelA->save();

        TestModelB::create(['test_model_a_id' => $modelA->id]);

        expect(fn () => RelationHelper::notFromRelation(new TestModelA, $modelA->id, 'testModelBHasMany', TestModelA::class))
            ->toThrow(InvalidArgumentException::class, 'The testModelBHasMany relation must return instances of Tests\\Fixtures\\Models\\TestModelA, but Tests\\Fixtures\\Models\\TestModelB was returned.');
    });

    test('supports class-string model and class-string related model', function () {
        $modelA = new TestModelA;
        $modelA->save();

        $related = TestModelB::create(['test_model_a_id' => $modelA->id]);
        $unrelated = TestModelB::create();

        $builder = RelationHelper::notFromRelation(TestModelA::class, $modelA->id, 'testModelBHasMany', TestModelB::class);

        $ids = $builder->pluck('id')->all();
        expect($ids)->not->toContain($related->id);
        expect($ids)->toContain($unrelated->id);
    });

    test('supports class-string model and instance related model', function () {
        $modelA = new TestModelA;
        $modelA->save();

        $related = TestModelB::create(['test_model_a_id' => $modelA->id]);
        $unrelated = TestModelB::create();

        $builder = RelationHelper::notFromRelation(TestModelA::class, $modelA->id, 'testModelBHasMany', new TestModelB);

        $ids = $builder->pluck('id')->all();
        expect($ids)->not->toContain($related->id);
        expect($ids)->toContain($unrelated->id);
    });

    test('supports instance model and instance related model', function () {
        $modelA = new TestModelA;
        $modelA->save();

        $related = TestModelB::create(['test_model_a_id' => $modelA->id]);
        $unrelated = TestModelB::create();

        $builder = RelationHelper::notFromRelation(new TestModelA, $modelA->id, 'testModelBHasMany', new TestModelB);

        $ids = $builder->pluck('id')->all();
        expect($ids)->not->toContain($related->id);
        expect($ids)->toContain($unrelated->id);
    });
});
