<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medication extends Model
{
    use HasFactory, Searchable;

    protected $table = 'medications';

    protected $guarded = [];

    protected $searchable = [
        'name',
        'dosage_form',
    ];

    protected function casts(): array
    {
        return [
        ];
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'medication_tags_tag_medications', 'tag_medications_id', 'medication_tags_id');
    }

    public function treatments()
    {
        return $this->belongsToMany(Treatment::class, 'medication_treatments_treatment_medications', 'treatment_medications_id', 'medication_treatments_id');
    }
}
