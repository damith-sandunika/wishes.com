<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
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

    public function publicIndex()
    {
        // For public, we return all settings for now since they are non-sensitive
        $settings = Setting::all();
        $result = [];
        foreach ($settings as $item) {
            $result[$item->key] = $item->value;
        }
        return response()->json($result);
    }

    public function update(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            $val = is_array($value) ? json_encode($value) : $value;
            Setting::set($key, $val);
        }
        return response()->json(['message' => 'Settings saved successfully']);
    }
}
