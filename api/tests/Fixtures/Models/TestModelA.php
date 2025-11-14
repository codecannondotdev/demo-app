<?php

namespace Tests\Fixtures\Models;

use Illuminate\Database\Eloquent\Model;

class TestModelA extends Model
{
    public $table = 'test_model_a';

    public $fillable = ['id', 'test_model_b_id'];

    public $timestamps = false;

    public function testModelBHasOne()
    {
        return $this->hasOne(TestModelB::class, 'test_model_a_id');
    }

    public function testModelBHasMany()
    {
        return $this->hasMany(TestModelB::class, 'test_model_a_id');
    }

    public function testModelBBelongsTo()
    {
        return $this->belongsTo(TestModelB::class, 'test_model_b_id');
    }

    public function testModelBBelongsToMany()
    {
        return $this->belongsToMany(TestModelB::class, 'test_model_a_test_model_b', 'test_model_a_id', 'test_model_b_id');
    }
}
