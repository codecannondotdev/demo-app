<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory, Searchable;

    protected $table = 'doctors';

    protected $guarded = [];

    protected $searchable = [
        'first_name',
        'last_name',
        'specialty',
        'email_address',
    ];

    protected $casts = [
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function treatments()
    {
        return $this->hasMany(Treatment::class, 'doctor_id');
    }
}
