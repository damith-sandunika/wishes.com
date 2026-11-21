<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use App\Services\ImageOptimizerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    public function index()
    {
        return response()->json(Slider::orderBy('sort_order')->get());
    }

    public function publicIndex()
    {
        $sliders = Slider::where('is_active', true)->orderBy('sort_order')->get();
        if ($sliders->isEmpty()) {
            $sliders = Slider::orderBy('sort_order')->get();
        }
        return response()->json($sliders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:150',
            'link' => 'nullable|string|max:255',
            'sort_order' => 'required|integer|min:1|max:4',
            'is_active' => 'nullable|boolean',
            'image' => 'required|file|mimes:jpg,jpeg,png,webp|max:3072',
            'mobile_image' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = app(ImageOptimizerService::class)->optimizeAndStore(
                $request->file('image'), 'sliders', 'hero-banner-' . $request->sort_order, 1920
            );
        }

        if ($request->hasFile('mobile_image')) {
            $validated['mobile_image'] = app(ImageOptimizerService::class)->optimizeAndStore(
                $request->file('mobile_image'), 'sliders', 'hero-mobile-' . $request->sort_order, 1080
            );
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $slider = Slider::create($validated);

        Cache::forget('public_sliders_active');

        return response()->json($slider, 201);
    }

    public function show(Slider $slider)
    {
        return response()->json($slider);
    }

    public function update(Request $request, Slider $slider)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:150',
            'link' => 'nullable|string|max:255',
            'sort_order' => 'required|integer|min:1|max:4',
            'is_active' => 'nullable|boolean',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
            'mobile_image' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
        ]);

        if ($request->hasFile('image')) {
            if ($slider->image && !str_starts_with($slider->image, 'http')) {
                Storage::disk('public')->delete($slider->image);
            }
            $validated['image'] = app(ImageOptimizerService::class)->optimizeAndStore(
                $request->file('image'), 'sliders', 'hero-banner-' . $slider->sort_order, 1920
            );
        }

        if ($request->hasFile('mobile_image')) {
            if ($slider->mobile_image && !str_starts_with($slider->mobile_image, 'http')) {
                Storage::disk('public')->delete($slider->mobile_image);
            }
            $validated['mobile_image'] = app(ImageOptimizerService::class)->optimizeAndStore(
                $request->file('mobile_image'), 'sliders', 'hero-mobile-' . $slider->sort_order, 1080
            );
        } else {
            unset($validated['image']);
        }

        if ($request->has('is_active')) {
            $validated['is_active'] = $request->boolean('is_active');
        }

        $slider->update($validated);

        Cache::forget('public_sliders_active');

        return response()->json($slider);
    }

    public function destroy(Slider $slider)
    {
        if ($slider->image && !str_starts_with($slider->image, 'http')) {
            Storage::disk('public')->delete($slider->image);
        }
        if ($slider->mobile_image && !str_starts_with($slider->mobile_image, 'http')) {
            Storage::disk('public')->delete($slider->mobile_image);
        }
        $slider->delete();

        Cache::forget('public_sliders_active');

        return response()->json(['message' => 'Slider deleted successfully']);
    }
}
