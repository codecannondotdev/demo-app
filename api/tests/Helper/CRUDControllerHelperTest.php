<?php

use App\Http\Controllers\CRUDControllerHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\Fixtures\Models\TestModelA;
use Tests\Fixtures\Models\TestModelB;

test('list applies search within the relation constraint', function (string $relationFilter): void {
    Route::post('/test-models/list', fn (Request $request) => (new CRUDControllerHelper(new TestModelB))->list($request));

    $parent = TestModelA::create();
    $otherParent = TestModelA::create();

    TestModelB::create(['id' => 101, 'test_model_a_id' => $parent->id]);
    TestModelB::create(['id' => 102, 'test_model_a_id' => $parent->id]);
    TestModelB::create(['id' => 201, 'test_model_a_id' => $otherParent->id]);
    TestModelB::create(['id' => 202, 'test_model_a_id' => $otherParent->id]);

    $response = $this->postJson('/test-models/list', [
        $relationFilter => [
            'model' => TestModelA::class,
            'id' => $parent->id,
            'relation' => 'testModelBHasMany',
        ],
        'search' => '01',
    ]);

    $response->assertSuccessful()->assertJsonPath('total', 1);
    expect($response->collect('data')->pluck('id')->all())
        ->toBe([$relationFilter === 'fromRelation' ? 101 : 201]);
})->with(['fromRelation', 'notFromRelation']);
