<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Addon;
use App\Services\ImageOptimizerService;
use Illuminate\Http\Request;

class AddonController extends Controller
{
    public function index()
    {
        return response()->json(Addon::orderBy('sort_order')->latest('id')->get());
    }

    public function publicIndex()
    {
        return response()->json(Addon::where('is_active', true)->orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'is_price_editable' => 'nullable|boolean',
            'type' => 'nullable|string|in:addon,personalization',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'image_file' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image_file')) {
            $validated['image'] = '/storage/' . app(ImageOptimizerService::class)->optimizeAndStore(
                $request->file('image_file'), 'addons', (string)$validated['name'], 1200
            );
        }

        $addon = Addon::create($validated);

        return response()->json($addon, 201);
    }

    public function show(Addon $addon)
    {
        return response()->json($addon);
    }

    public function update(Request $request, Addon $addon)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'is_price_editable' => 'nullable|boolean',
            'type' => 'nullable|string|in:addon,personalization',
            'icon' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'image_file' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image_file')) {
            $validated['image'] = '/storage/' . app(ImageOptimizerService::class)->optimizeAndStore(
                $request->file('image_file'), 'addons', (string)$validated['name'], 1200
            );
        }

        $addon->update($validated);

        return response()->json($addon);
    }

    public function destroy(Addon $addon)
    {
        $addon->delete();

        return response()->json(['message' => 'Addon deleted successfully']);
    }
}
