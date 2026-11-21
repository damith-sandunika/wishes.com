<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            if (!$user->is_active) {
                Auth::guard('web')->logout();
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
            ]);
        }

        return response()->json([
            'message' => 'The provided credentials are incorrect.'
        ], 401);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email|max:150',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
            'is_active' => true,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Account created successfully',
        ], 201);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        return response()->json([
            ...$user->toArray(),
            'isAdmin' => in_array($user->role, ['admin', 'staff'], true),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => ['required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => 'nullable|string|max:30',
            'password' => 'nullable|string|min:6',
        ]);

        $user->name = $validated['name'];
        $user->email = strtolower(trim($validated['email']));
        $user->phone = $validated['phone'] ?? null;
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        return response()->json([
            'user' => $user,
            'message' => 'Profile updated successfully',
        ]);
    }

    public function deactivate(Request $request)
    {
        $user = $request->user();
        $user->is_active = false;
        $user->save();
        $user->tokens()->delete();
        Auth::guard('web')->logout();

        return response()->json([
            'message' => 'Account deactivated successfully. All past order records remain safely archived.',
        ]);
    }

    public function orders(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([], 401);
        }

        $perPage = min(50, max(5, (int)$request->get('per_page', 15)));

        $orders = Order::with('items')
            ->where('user_id', $user->id)
            ->latest()
            ->paginate($perPage);

        return response()->json($orders);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();
        Auth::guard('web')->logout();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
