<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory, Searchable;

    protected $table = 'departments';

    protected $guarded = [];

    protected $searchable = [
        'name',
        'location',
    ];

    protected $casts = [
    ];

    public function doctors()
    {
        return $this->hasMany(Doctor::class, 'department_id');
    }

    public function nurses()
    {
        return $this->hasMany(Nurse::class, 'department_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'department_id');
    }
}
