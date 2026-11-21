<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class StaffController extends Controller
{
    public function index()
    {
        $staff = User::whereIn('role', ['admin', 'staff'])
            ->latest()
            ->get(['id', 'name', 'email', 'phone', 'role', 'is_active', 'created_at']);

        return response()->json($staff);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email|max:150',
            'phone' => 'nullable|string|max:30',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,staff',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_active' => true,
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $staff)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => ['required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($staff->id)],
            'phone' => 'nullable|string|max:30',
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:admin,staff',
            'is_active' => 'boolean',
        ]);

        $staff->name = $validated['name'];
        $staff->email = strtolower(trim($validated['email']));
        $staff->phone = $validated['phone'] ?? null;
        $staff->role = $validated['role'];
        if (isset($validated['is_active'])) {
            $staff->is_active = (bool)$validated['is_active'];
        }
        if (!empty($validated['password'])) {
            $staff->password = Hash::make($validated['password']);
        }
        $staff->save();

        return response()->json($staff);
    }

    public function destroy(Request $request, User $staff)
    {
        if ($staff->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 400);
        }

        $staff->delete();
        return response()->json(['message' => 'Staff member deleted successfully.']);
    }
}
