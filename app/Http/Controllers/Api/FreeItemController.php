<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FreeItem;
use App\Services\ImageOptimizerService;
use Illuminate\Http\Request;

class FreeItemController extends Controller
{
    public function index()
    {
        return response()->json(FreeItem::orderBy('sort_order')->latest('id')->get());
    }

    public function publicIndex()
    {
        return response()->json(FreeItem::where('is_active', true)->orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'image_file' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image_file')) {
            $path = app(ImageOptimizerService::class)->optimizeAndStore(
                $request->file('image_file'), 'free-items', (string)$validated['name'], 800
            );
            $validated['image'] = "/storage/{$path}";
        }

        $item = FreeItem::create($validated);
        return response()->json($item, 201);
    }

    public function show(FreeItem $freeItem)
    {
        return response()->json($freeItem);
    }

    public function update(Request $request, FreeItem $freeItem)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'image_file' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image_file')) {
            $path = app(ImageOptimizerService::class)->optimizeAndStore(
                $request->file('image_file'), 'free-items', (string)$validated['name'], 800
            );
            $validated['image'] = "/storage/{$path}";
        }

        $freeItem->update($validated);
        return response()->json($freeItem);
    }

    public function destroy(FreeItem $freeItem)
    {
        $freeItem->delete();
        return response()->json(['message' => 'Free item deleted successfully']);
    }
}
