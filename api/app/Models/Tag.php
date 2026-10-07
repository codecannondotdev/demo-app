<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory, Searchable;

    protected $table = 'tags';

    protected $guarded = [];

    protected $searchable = [
    ];

    protected function casts(): array
    {
        return [
        ];
    }

    public function medications()
    {
        return $this->belongsToMany(Medication::class, 'medication_tags_tag_medications', 'medication_tags_id', 'tag_medications_id');
    }
}
