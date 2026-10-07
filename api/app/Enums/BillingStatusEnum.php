<?php

namespace App\Enums;

enum BillingStatusEnum: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case OVERDUE = 'overdue';
}
