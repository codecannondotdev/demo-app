<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    use HasFactory, Searchable;

    protected $table = 'billings';

    protected $guarded = [];

    protected $searchable = [
        'billing_date',
        'amount',
        'status',
        'payment_method',
    ];

    protected $casts = [
        'billing_date' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class, 'appointment_id');
    }
}
