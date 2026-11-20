<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    public function index()
    {
        return response()->json(Slider::orderBy('sort_order')->get());
    }

    public function publicIndex()
    {
        return response()->json(Slider::where('is_active', true)->orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:150',
            'link' => 'nullable|string|max:255',
            'sort_order' => 'required|integer|min:1|max:4',
            'is_active' => 'nullable|boolean',
            'image' => 'required',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $slider = Slider::create($validated);

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
            'image' => 'nullable',
        ]);

        if ($request->hasFile('image')) {
            if ($slider->image && !str_starts_with($slider->image, 'http')) {
                Storage::disk('public')->delete($slider->image);
            }
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        } else {
            unset($validated['image']);
        }

        if ($request->has('is_active')) {
            $validated['is_active'] = $request->boolean('is_active');
        }

        $slider->update($validated);

        return response()->json($slider);
    }

    public function destroy(Slider $slider)
    {
        if ($slider->image && !str_starts_with($slider->image, 'http')) {
            Storage::disk('public')->delete($slider->image);
        }
        $slider->delete();

        return response()->json(['message' => 'Slider deleted successfully']);
    }
}
