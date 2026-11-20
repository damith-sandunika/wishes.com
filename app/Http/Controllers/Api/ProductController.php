<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with(['category', 'reviews'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|unique:products',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'images' => 'nullable',
            'color_variations' => 'nullable',
            'allowed_addons' => 'nullable',
            'occasions' => 'nullable',
            'occasions' => 'nullable',
            'enable_personalization' => 'nullable|boolean',
            'enable_wrapping' => 'nullable|boolean',
            'brand' => 'nullable|string',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'current_stock' => 'nullable|integer',
            'selling_price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'status' => 'nullable|boolean',
            'stock_availability' => 'nullable|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $images = [];

        if ($request->hasFile('image')) {
            $images[] = $request->file('image')->store('products', 'public');
        }
        if ($request->hasFile('extra_images')) {
            foreach ($request->file('extra_images') as $f) {
                $images[] = $f->store('products', 'public');
            }
        }
        if ($request->filled('images')) {
            $parsed = is_string($request->images) ? json_decode($request->images, true) : $request->images;
            if (is_array($parsed)) $images = array_merge($images, $parsed);
        }
        $validated['images'] = array_values(array_unique(array_filter($images)));

        if ($request->has('color_variations')) {
            $validated['color_variations'] = is_string($request->color_variations) 
                ? json_decode($request->color_variations, true) : $request->color_variations;
        }
        if ($request->has('allowed_addons')) {
            $validated['allowed_addons'] = is_string($request->allowed_addons) 
                ? json_decode($request->allowed_addons, true) : $request->allowed_addons;
        }
        if ($request->has('occasions')) {
            $validated['occasions'] = is_string($request->occasions) 
                ? json_decode($request->occasions, true) : $request->occasions;
        }
        $validated['enable_personalization'] = $request->boolean('enable_personalization', false);
        $validated['enable_wrapping'] = $request->boolean('enable_wrapping', true);

        $product = Product::create($validated);
        return response()->json($product->load(['category', 'reviews']), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'reviews']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'images' => 'nullable',
            'color_variations' => 'nullable',
            'allowed_addons' => 'nullable',
            'occasions' => 'nullable',
            'occasions' => 'nullable',
            'enable_personalization' => 'nullable|boolean',
            'enable_wrapping' => 'nullable|boolean',
            'brand' => 'nullable|string',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'current_stock' => 'nullable|integer',
            'selling_price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'status' => 'nullable|boolean',
            'stock_availability' => 'nullable|boolean',
        ]);

        if ($request->name !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $images = $product->images ?? [];
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            if (!empty($images)) $images[0] = $path; else $images[] = $path;
        }
        if ($request->hasFile('extra_images')) {
            foreach ($request->file('extra_images') as $f) {
                $images[] = $f->store('products', 'public');
            }
        }
        if ($request->filled('images')) {
            $parsed = is_string($request->images) ? json_decode($request->images, true) : $request->images;
            if (is_array($parsed)) $images = array_merge($images, $parsed);
        }
        $validated['images'] = array_values(array_unique(array_filter($images)));

        if ($request->has('color_variations')) {
            $validated['color_variations'] = is_string($request->color_variations) 
                ? json_decode($request->color_variations, true) : $request->color_variations;
        }
        if ($request->has('allowed_addons')) {
            $validated['allowed_addons'] = is_string($request->allowed_addons) 
                ? json_decode($request->allowed_addons, true) : $request->allowed_addons;
        }
        if ($request->has('occasions')) {
            $validated['occasions'] = is_string($request->occasions) 
                ? json_decode($request->occasions, true) : $request->occasions;
        }
        $validated['enable_personalization'] = $request->boolean('enable_personalization', false);
        $validated['enable_wrapping'] = $request->boolean('enable_wrapping', true);

        $product->update($validated);
        return response()->json($product->load(['category', 'reviews']));
    }

    public function addReview(Request $request, Product $product)
    {
        $validated = $request->validate([
            'author_name' => 'required|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:150',
            'content' => 'required|string|max:1000',
        ]);

        $review = $product->reviews()->create([
            'user_id' => auth('sanctum')->id() ?? auth()->id(),
            'author_name' => $validated['author_name'],
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? 'Wonderful gift',
            'content' => $validated['content'],
            'is_approved' => true,
        ]);

        return response()->json($review, 201);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
