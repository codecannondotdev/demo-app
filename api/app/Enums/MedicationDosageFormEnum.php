<?php

namespace App\Enums;

enum MedicationDosageFormEnum: string
{
    case TABLET = 'tablet';
    case CAPSULE = 'capsule';
    case INJECTION = 'injection';
    case SYRUP = 'syrup';
}
