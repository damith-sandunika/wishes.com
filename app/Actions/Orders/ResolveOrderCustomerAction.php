<?php

declare(strict_types=1);

namespace App\Actions\Orders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ResolveOrderCustomerAction
{
    /**
     * Resolve existing user ID or register a new customer account.
     *
     * @return array{0: ?int, 1: ?User, 2: ?string} [userId, createdUser, token]
     */
    public function execute(array $data, ?int $userId = null): array
    {
        $createdUser = null;
        $token = null;

        if (empty($data['sender_email'])) {
            return [$userId, null, null];
        }

        $email = strtolower(trim((string)$data['sender_email']));

        if (!$userId && (!empty($data['password']) || !empty($data['create_account']))) {
            $existing = User::where('email', $email)->first();
            if ($existing) {
                $userId = $existing->id;
                $createdUser = $existing;
            } else {
                $pwd = !empty($data['password']) ? (string)$data['password'] : Str::random(12);
                $createdUser = User::create([
                    'name' => (string)$data['customer_name'],
                    'email' => $email,
                    'password' => Hash::make($pwd),
                    'role' => 'customer',
                ]);
                $userId = $createdUser->id;
            }
            $token = $createdUser->createToken('customer_token')->plainTextToken;
        } elseif (!$userId) {
            $existing = User::where('email', $email)->first();
            if ($existing) {
                $userId = $existing->id;
            }
        }

        return [$userId, $createdUser, $token];
    }
}
