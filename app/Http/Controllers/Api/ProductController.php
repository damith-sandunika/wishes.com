<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ImageOptimizerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'reviews']);

        if (!$request->user() || !$request->user()->isAdmin()) {
            $query->active();
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('sku', 'like', "%{$s}%")
                  ->orWhere('short_description', 'like', "%{$s}%");
            });
        }

        if ($request->filled('min_price')) {
            $query->where('selling_price', '>=', (float)$request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('selling_price', '<=', (float)$request->max_price);
        }

        match ($request->get('sort', 'latest')) {
            'price_asc' => $query->orderBy('selling_price', 'asc'),
            'price_desc' => $query->orderBy('selling_price', 'desc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            default => $query->latest(),
        };

        if ($request->has('page') || $request->has('per_page') || $request->boolean('paginate')) {
            $perPage = min(100, max(1, (int)$request->get('per_page', 12)));
            return response()->json($query->paginate($perPage));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $this->validateProduct($request);
        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::lower(Str::random(4));
        $validated['images'] = $this->processProductImages($request);
        $validated['color_variations'] = $this->parseJsonField($request->color_variations);
        $validated['allowed_addons'] = $this->parseJsonField($request->allowed_addons);
        $validated['occasions'] = $this->parseJsonField($request->occasions);
        $validated['enable_personalization'] = $request->boolean('enable_personalization', false);
        $validated['enable_wrapping'] = $request->boolean('enable_wrapping', true);

        $product = Product::create($validated);
        Cache::forget('public_products_active');

        return response()->json($product->load(['category', 'reviews']), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'reviews']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $this->validateProduct($request, $product->id);
        if ($request->name !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::lower(Str::random(4));
        }

        $validated['images'] = $this->processProductImages($request, $product->images ?? []);
        if ($request->has('color_variations')) $validated['color_variations'] = $this->parseJsonField($request->color_variations);
        if ($request->has('allowed_addons')) $validated['allowed_addons'] = $this->parseJsonField($request->allowed_addons);
        if ($request->has('occasions')) $validated['occasions'] = $this->parseJsonField($request->occasions);
        $validated['enable_personalization'] = $request->boolean('enable_personalization', false);
        $validated['enable_wrapping'] = $request->boolean('enable_wrapping', true);

        $product->update($validated);
        Cache::forget('public_products_active');

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
            'author_name' => strip_tags($validated['author_name']),
            'rating' => $validated['rating'],
            'title' => strip_tags($validated['title'] ?? 'Wonderful gift'),
            'content' => strip_tags($validated['content']),
            'is_approved' => true,
        ]);

        return response()->json($review, 201);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        Cache::forget('public_products_active');
        return response()->json(['message' => 'Product deleted successfully']);
    }

    private function validateProduct(Request $request, ?int $ignoreId = null): array
    {
        $skuRule = $ignoreId ? "nullable|string|unique:products,sku,{$ignoreId}" : 'nullable|string|unique:products';
        return $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => $skuRule,
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'brand' => 'nullable|string|max:100',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'unit_type' => 'nullable|string|max:50',
            'current_stock' => 'nullable|integer|min:0',
            'selling_price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'status' => 'nullable|boolean',
            'stock_availability' => 'nullable|boolean',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
            'extra_images.*' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
        ]);
    }

    private function processProductImages(Request $request, array $existing = []): array
    {
        $images = is_array($existing) ? $existing : [];
        if ($request->filled('images')) {
            $parsed = is_string($request->images) ? json_decode($request->images, true) : $request->images;
            if (is_array($parsed) && !empty($parsed)) $images = $parsed;
        }
        $optimizer = app(ImageOptimizerService::class);
        $title = (string)$request->input('name', 'product');

        if ($request->hasFile('image')) {
            $path = $optimizer->optimizeAndStore($request->file('image'), 'products', $title, 1200);
            if (!empty($images)) $images[0] = $path; else $images[] = $path;
        }
        if ($request->hasFile('extra_images')) {
            foreach ($request->file('extra_images') as $i => $f) {
                $images[] = $optimizer->optimizeAndStore($f, 'products', "{$title}-{$i}", 1200);
            }
        }
        return array_values(array_unique(array_filter($images)));
    }

    private function parseJsonField(mixed $val): ?array
    {
        if (is_null($val)) return null;
        return is_string($val) ? json_decode($val, true) : (is_array($val) ? $val : null);
    }
}
