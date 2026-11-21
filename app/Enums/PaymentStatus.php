<?php

declare(strict_types=1);

namespace App\Enums;

enum PaymentStatus: string
{
    case PENDING = 'Pending';
    case PAID = 'Paid';
    case FAILED = 'Failed';
    case REFUNDED = 'Refunded';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
