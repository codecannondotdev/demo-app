<?php

namespace App\Enums;

enum BillingPaymentMethodEnum: string
{
    case CASH = 'cash';
    case CREDIT_CARD = 'credit_card';
    case INSURANCE = 'insurance';
}
