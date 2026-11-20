<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $query = Review::with(['product:id,name,images,sku,selling_price'])->latest();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('author_name', 'like', "%{$s}%")
                  ->orWhere('title', 'like', "%{$s}%")
                  ->orWhere('content', 'like', "%{$s}%")
                  ->orWhereHas('product', function ($pq) use ($s) {
                      $pq->where('name', 'like', "%{$s}%");
                  });
            });
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        return response()->json($query->paginate(30));
    }

    public function toggleApprove(Review $review)
    {
        $review->update(['is_approved' => !$review->is_approved]);
        return response()->json(['message' => 'Review status updated', 'review' => $review]);
    }

    public function publicReviews()
    {
        return response()->json(
            Review::with(['product:id,name,images,sku'])
                ->where('is_approved', true)
                ->latest()
                ->take(12)
                ->get()
        );
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return response()->json(['message' => 'Review deleted successfully']);
    }
}
