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

    protected $casts = [
    ];

    public function medications()
    {
        return $this->belongsToMany(Medication::class, 'medications_tags', 'tags_id', 'medications_id');
    }
}
