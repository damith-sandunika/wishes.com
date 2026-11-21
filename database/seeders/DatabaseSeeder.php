<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with only the primary Admin account.
     * All store products, categories, sliders, and coupons are managed
     * exclusively via the Admin Panel by real store administrators.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@wishes.com'],
            [
                'name' => 'Wishes Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $this->call(OccasionSeeder::class);
        $this->call(AddonSeeder::class);
    }
}
