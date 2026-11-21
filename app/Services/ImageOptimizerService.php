<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ImageOptimizerService
{
    public const MAX_BYTES = 3145728; // 3MB (3 * 1024 * 1024)
    public const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp'];

    /**
     * Validate, downscale, strip EXIF and convert image to WebP with SEO naming.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @param string $seoTitle
     * @param int $maxWidth
     * @param int $quality
     * @return string Relative storage path (e.g. "products/wishes-com-red-roses-1732152840-a1b2.webp")
     * @throws ValidationException
     */
    public function optimizeAndStore(
        UploadedFile $file,
        string $folder = 'products',
        string $seoTitle = 'item',
        int $maxWidth = 1200,
        int $quality = 82
    ): string {
        $ext = strtolower($file->getClientOriginalExtension());
        if (!in_array($ext, self::ALLOWED_EXTS, true)) {
            throw ValidationException::withMessages([
                'image' => "Invalid file format (.{$ext})! Only JPG, JPEG, PNG, and WEBP image files are allowed."
            ]);
        }

        if ($file->getSize() > self::MAX_BYTES) {
            $sizeMb = round($file->getSize() / (1024 * 1024), 1);
            throw ValidationException::withMessages([
                'image' => "File size ({$sizeMb}MB) exceeds the 3MB limit! Please choose an image under 3MB."
            ]);
        }

        $slug = Str::slug($seoTitle);
        $cleanSlug = !empty($slug) ? $slug : 'gift-item';
        $filename = "wishes-com-{$cleanSlug}-" . time() . '-' . Str::lower(Str::random(5)) . '.webp';
        $targetPath = trim($folder, '/') . '/' . $filename;

        $realPath = $file->getRealPath();
        $srcImage = @imagecreatefromstring((string) file_get_contents($realPath));

        if (!$srcImage) {
            return $file->storeAs($folder, $filename, 'public');
        }

        $origWidth = imagesx($srcImage);
        $origHeight = imagesy($srcImage);

        // Auto-orient EXIF if camera rotation exists
        if (function_exists('exif_read_data')) {
            try {
                $exif = @exif_read_data($realPath);
                if (!empty($exif['Orientation'])) {
                    $srcImage = match ($exif['Orientation']) {
                        3 => imagerotate($srcImage, 180, 0),
                        6 => imagerotate($srcImage, -90, 0),
                        8 => imagerotate($srcImage, 90, 0),
                        default => $srcImage,
                    };
                    $origWidth = imagesx($srcImage);
                    $origHeight = imagesy($srcImage);
                }
            } catch (\Throwable $e) {}
        }

        // Calculate proportionate downscale
        $newWidth = $origWidth;
        $newHeight = $origHeight;

        if ($origWidth > $maxWidth) {
            $ratio = $maxWidth / $origWidth;
            $newWidth = $maxWidth;
            $newHeight = (int) round($origHeight * $ratio);
        }

        $targetImage = imagecreatetruecolor($newWidth, $newHeight);

        // Preserve transparency for PNG and WebP
        imagealphablending($targetImage, false);
        imagesavealpha($targetImage, true);
        $transparent = imagecolorallocatealpha($targetImage, 255, 255, 255, 127);
        imagefilledrectangle($targetImage, 0, 0, $newWidth, $newHeight, $transparent);

        imagecopyresampled(
            $targetImage,
            $srcImage,
            0, 0, 0, 0,
            $newWidth,
            $newHeight,
            $origWidth,
            $origHeight
        );

        ob_start();
        imagewebp($targetImage, null, $quality);
        $webpContent = ob_get_clean();

        imagedestroy($srcImage);
        imagedestroy($targetImage);

        $disk = config('filesystems.image_disk', 'public');

        try {
            if (!empty($webpContent)) {
                Storage::disk($disk)->put($targetPath, $webpContent, 'public');
                return ($disk === 'r2' || $disk === 's3')
                    ? Storage::disk($disk)->url($targetPath)
                    : $targetPath;
            }

            $storedPath = $file->storeAs($folder, $filename, $disk);
            return ($disk === 'r2' || $disk === 's3')
                ? Storage::disk($disk)->url($storedPath)
                : $storedPath;
        } catch (\Throwable $e) {
            if ($disk !== 'public') {
                if (!empty($webpContent)) {
                    Storage::disk('public')->put($targetPath, $webpContent);
                    return $targetPath;
                }
                return $file->storeAs($folder, $filename, 'public');
            }
            throw ValidationException::withMessages(['image' => 'Storage error: ' . $e->getMessage()]);
        }
    }
}
