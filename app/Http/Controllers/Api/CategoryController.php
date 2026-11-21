<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Services\ImageOptimizerService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('status', true)->orderBy('sort_order')->get();
        if ($categories->isEmpty()) {
            $categories = Category::orderBy('sort_order')->get();
        }
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
            'description' => 'nullable|string',
            'status' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = app(ImageOptimizerService::class)->optimizeAndStore(
                $request->file('image'), 'categories', (string)$request->name, 1200
            );
        } elseif ($request->image === 'null') {
            $validated['image'] = null;
        }

        $validated['slug'] = Str::slug($validated['name']);
        if (!isset($validated['sort_order'])) {
            $validated['sort_order'] = ((int)Category::max('sort_order')) + 1;
        }
        
        $category = Category::create($validated);

        Cache::forget('public_categories');

        return response()->json($category, 201);
    }

    public function show(Category $category)
    {
        return response()->json($category);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable',
            'description' => 'nullable|string',
            'status' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $request->validate(['image' => 'file|mimes:jpg,jpeg,png,webp|max:3072']);
            $validated['image'] = app(ImageOptimizerService::class)->optimizeAndStore(
                $request->file('image'), 'categories', (string)$request->name, 1200
            );
        } elseif ($request->image === 'null') {
            $validated['image'] = null;
        } else {
            unset($validated['image']);
        }

        if ($request->name !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        Cache::forget('public_categories');

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        Cache::forget('public_categories');
        return response()->json(['message' => 'Category deleted successfully']);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:categories,id',
        ]);

        foreach ($validated['order'] as $index => $id) {
            Category::where('id', $id)->update(['sort_order' => $index + 1]);
        }

        Cache::forget('public_categories');
        return response()->json(['message' => 'Categories reordered successfully']);
    }
}
