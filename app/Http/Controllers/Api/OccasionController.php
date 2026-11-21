<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Occasion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class OccasionController extends Controller
{
    public function index()
    {
        return response()->json(Occasion::orderBy('sort_order')->latest('id')->get());
    }

    public function publicIndex()
    {
        return response()->json(Occasion::where('is_active', true)->orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:occasions,slug',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable',
            'bg_gradient' => 'nullable|string|max:100',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('image_file')) {
            $validated['image'] = '/storage/' . $request->file('image_file')->store('occasions', 'public');
        }

        $occasion = Occasion::create($validated);

        Cache::forget('public_occasions_active');

        return response()->json($occasion, 201);
    }

    public function show(Occasion $occasion)
    {
        return response()->json($occasion);
    }

    public function update(Request $request, Occasion $occasion)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:150',
            'slug' => 'nullable|string|max:150|unique:occasions,slug,' . $occasion->id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable',
            'bg_gradient' => 'nullable|string|max:100',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (!empty($validated['title']) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('image_file')) {
            $validated['image'] = '/storage/' . $request->file('image_file')->store('occasions', 'public');
        }

        $occasion->update($validated);

        Cache::forget('public_occasions_active');

        return response()->json($occasion);
    }

    public function destroy(Occasion $occasion)
    {
        $occasion->delete();

        Cache::forget('public_occasions_active');

        return response()->json(['message' => 'Occasion deleted successfully']);
    }
}
