<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    /**
     * Authenticated Admin Index (returns all settings grouped)
     */
    public function index()
    {
        $settings = Setting::all()->groupBy('group');
        $result = [];
        foreach ($settings as $group => $items) {
            foreach ($items as $item) {
                $result[$item->key] = $item->value;
            }
        }
        return response()->json($result);
    }

    /**
     * Public Settings (Strictly Whitelisted to prevent leaking sensitive API tokens / admin numbers)
     */
    public function publicIndex()
    {
        $allowedKeys = [
            'shop_name',
            'shop_email',
            'shop_phone',
            'shop_address',
            'shop_currency',
            'delivery_charge',
            'free_delivery_above',
            'bank_name',
            'bank_branch',
            'bank_account_name',
            'bank_account_number',
            'social_facebook',
            'social_instagram',
            'social_tiktok',
            'social_youtube',
            'social_whatsapp',
            'whatsapp_number',
            'faq_items',
            'faq_support_text',
            'policy_delivery_highlights',
            'policy_delivery',
            'policy_privacy',
            'policy_terms',
            'policy_returns',
        ];

        $settings = Cache::remember('public_settings', 3600, function () use ($allowedKeys) {
            return Setting::whereIn('key', $allowedKeys)->pluck('value', 'key');
        });

        return response()->json($settings);
    }

    public function update(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            $val = is_array($value) ? json_encode($value) : $value;
            Setting::set($key, (string) $val);
        }

        Cache::forget('public_settings');

        return response()->json(['message' => 'Settings saved successfully']);
    }
}
