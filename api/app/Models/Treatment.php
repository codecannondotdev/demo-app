<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Treatment extends Model
{
    use HasFactory, Searchable;

    protected $table = 'treatments';

    protected $guarded = [];

    protected $searchable = [
        'treatment_date',
        'description',
        'outcome',
        'cost',
    ];

    protected $casts = [
        'treatment_date' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function medications()
    {
        return $this->belongsToMany(Medication::class, 'medications_treatments', 'treatments_id', 'medications_id');
    }
}
