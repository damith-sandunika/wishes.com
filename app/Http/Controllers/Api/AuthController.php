<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json(['user' => $user, 'token' => $token]);
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
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Account created successfully'
        ], 201);
    }

    public function user(Request $request)
    {
        return response()->json(Auth::user());
    }

    public function orders(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json([], 401);

        $orders = \App\Models\Order::with('items')
            ->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('customer_name', $user->name);
            })
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
