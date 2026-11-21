<?php

use Illuminate\Support\Facades\Route;

// 1. Direct storage server route with CORS and correct mime-types
Route::get('/storage/{path}', function ($path) {
    $filePath = public_path('storage/' . $path);
    if (!file_exists($filePath)) {
        $filePath = storage_path('app/public/' . $path);
    }

    // Fallback: search in common subdirectories if bare filename given
    if (!file_exists($filePath)) {
        foreach (['sliders', 'categories', 'products', 'slips'] as $sub) {
            $candidate = public_path("storage/{$sub}/{$path}");
            if (file_exists($candidate) && !is_dir($candidate)) {
                $filePath = $candidate;
                break;
            }
            $candidate2 = storage_path("app/public/{$sub}/{$path}");
            if (file_exists($candidate2) && !is_dir($candidate2)) {
                $filePath = $candidate2;
                break;
            }
        }
    }

    if (!file_exists($filePath) || is_dir($filePath)) {
        abort(404);
    }

    $mime = mime_content_type($filePath) ?: 'application/octet-stream';
    return response()->file($filePath, [
        'Content-Type' => $mime,
        'Access-Control-Allow-Origin' => '*',
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*');

// 2. Direct fallback for bare image asset filenames requested at root
Route::get('/{filename}', function ($filename) {
    foreach (['', 'sliders/', 'categories/', 'products/', 'slips/'] as $sub) {
        $candidate = public_path("storage/{$sub}{$filename}");
        if (file_exists($candidate) && !is_dir($candidate)) {
            $mime = mime_content_type($candidate) ?: 'image/png';
            return response()->file($candidate, [
                'Content-Type' => $mime,
                'Access-Control-Allow-Origin' => '*',
                'Cache-Control' => 'public, max-age=86400',
            ]);
        }
    }
    abort(404);
})->where('filename', '^[a-zA-Z0-9_\-\.]+\.(png|jpg|jpeg|gif|webp|svg|ico)$');

// 3. Catch-all route to serve the React SPA
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
