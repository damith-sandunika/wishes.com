<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    public function google(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'required|string|max:150',
            'google_id' => 'nullable|string',
            'avatar' => 'nullable|string',
        ]);

        $email = strtolower(trim($validated['email']));
        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $email,
                'password' => Hash::make(Str::random(32)),
                'role' => 'customer',
                'is_active' => true,
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'This account has been deactivated. Please contact support.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'isAdmin' => in_array($user->role, ['admin', 'staff'], true),
            'role' => $user->role,
            'message' => 'Signed in successfully via Google'
        ]);
    }
}
