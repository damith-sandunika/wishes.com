<?php

declare(strict_types=1);

namespace App\Enums;

enum PaymentMethod: string
{
    case COD = 'Cash On Delivery';
    case BANK_TRANSFER = 'Bank Transfer';
    case ONLINE = 'Online Payment';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
