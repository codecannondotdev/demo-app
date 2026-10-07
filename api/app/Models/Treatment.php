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

    protected function casts(): array
    {
        return [
            'treatment_date' => 'datetime',
        ];
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function medications()
    {
        return $this->belongsToMany(Medication::class, 'medication_treatments_treatment_medications', 'medication_treatments_id', 'treatment_medications_id');
    }
}
