<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function sendResetCode(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email'
        ]);

        $email = strtolower(trim($validated['email']));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'If an account exists with this email, a reset code has been sent.'
            ]);
        }

        // Generate 6-digit verification code
        $code = (string) rand(100000, 999999);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($code),
                'created_at' => now(),
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Password reset verification code has been dispatched.',
            'demo_code' => $code, // Displayed for convenience and testing
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $email = strtolower(trim($validated['email']));
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record) {
            return response()->json(['message' => 'Invalid or expired password reset request.'], 400);
        }

        // Check if code was generated within the last 60 minutes
        if ($record->created_at && now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return response()->json(['message' => 'Reset code has expired. Please request a new one.'], 400);
        }

        if (!Hash::check((string)$validated['code'], $record->token) && $validated['code'] !== $record->token) {
            return response()->json(['message' => 'Incorrect verification code. Please check your email.'], 400);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['message' => 'User account not found.'], 404);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Your password has been reset successfully! You can now sign in with your new password.',
        ]);
    }
}
