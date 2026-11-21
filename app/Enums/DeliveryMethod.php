<?php

declare(strict_types=1);

namespace App\Enums;

enum DeliveryMethod: string
{
    case STANDARD = 'standard';
    case SAMEDAY = 'sameday';
    case SCHEDULED = 'scheduled';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function defaultCharge(): float
    {
        return match ($this) {
            self::SAMEDAY => 750.0,
            default => 350.0,
        };
    }
}
