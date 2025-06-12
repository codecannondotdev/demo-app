<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nurse extends Model
{
    use HasFactory, Searchable;

    protected $table = 'nurses';

    protected $guarded = [];

    protected $searchable = [
        'first_name',
        'last_name',
        'shift',
        'contact_number',
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
        return $this->hasMany(Appointment::class, 'nurse_id');
    }
}
