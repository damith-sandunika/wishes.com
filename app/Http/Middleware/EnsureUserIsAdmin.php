<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request. Allows admin and staff members.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, ['admin', 'staff'], true) || !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. Staff or administrator privileges required.',
            ], 403);
        }

        return $next($request);
    }
}
