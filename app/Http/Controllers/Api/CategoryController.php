<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
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
            'image' => 'nullable',
            'description' => 'nullable|string',
            'status' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        } elseif ($request->image === 'null') {
            $validated['image'] = null;
        }

        $validated['slug'] = Str::slug($validated['name']);
        
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
            $validated['image'] = $request->file('image')->store('categories', 'public');
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
}
