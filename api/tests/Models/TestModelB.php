<?php

namespace Tests\Models;

use Illuminate\Database\Eloquent\Model;

class TestModelB extends Model
{
    public $table = 'test_model_b';

    public $fillable = ['id', 'test_model_a_id'];

    public $timestamps = false;

    public function testModelAHasOne()
    {
        return $this->hasOne(TestModelA::class, 'test_model_b_id');
    }

    public function testModelAHasMany()
    {
        return $this->hasMany(TestModelA::class, 'test_model_b_id');
    }

    public function testModelABelongsTo()
    {
        return $this->belongsTo(TestModelA::class, 'test_model_a_id');
    }

    public function testModelABelongsToMany()
    {
        return $this->belongsToMany(TestModelA::class, 'test_model_a_test_model_b', 'test_model_b_id', 'test_model_a_id');
    }
}
