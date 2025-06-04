<?php

namespace Helpers;

/**
 * FileHelper
 *  - Generic image upload/processing utility for single or multiple images.
 *  - Handles file naming, resizing, WebP conversion, and folder structure.
 */
class FileHelper
{
    /**
     * Handles uploading and processing (WebP, resizing) for one or more images.
     *
     * @param array $file         Either a single $_FILES['field'], or a multiple-file $_FILES entry.
     * @param string $destDir     Relative dir under /images/ (e.g., banners/17 or products/5).
     * @param array $options      - max_size (int, bytes)
     *                            - allowed_mimes (array)
     *                            - generate_webp (bool)
     *                            - resize (array: [ [w, h, suffix], ... ])
     *                            - custom_names (array: key => basename for banners)
     * @return array              ['success'=>[...], 'errors'=>[...]]
     */
    public static function handleImageUpload($file, $destDir, $options = [])
    {
        $results = ['success' => [], 'errors' => []];
        $baseDir = defined('WEBSITE_ROOT') ? WEBSITE_ROOT : dirname(__DIR__, 2);
        $targetDir = $baseDir . "/images/" . $destDir;

        if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);

        $isMulti = is_array($file['name']);
        $files = $isMulti
            ? array_map(
                fn($idx) => [
                    'name' => $file['name'][$idx],
                    'tmp_name' => $file['tmp_name'][$idx],
                    'error' => $file['error'][$idx],
                    'size' => $file['size'][$idx]
                ],
                array_keys($file['name'])
            )
            : [$file];

        // Support for banners: custom_names as key => filename
        $names = $options['custom_names'] ?? [];

        foreach ($files as $idx => $f) {
            // Use custom name (for banners), else random for products
            $customName = $names[$idx] ?? $names[$f['name']] ?? null;
            $res = self::processSingleImage($f, $targetDir, $options, $customName);
            if (!empty($res['error'])) {
                $results['errors'][] = ['file' => $f['name'], 'error' => $res['error']];
            } else {
                $results['success'][] = $res;
            }
        }
        return $results;
    }

    /**
     * Process a single image file, returning array of URLs or error.
     */
    private static function processSingleImage($f, $targetDir, $options, $customName = null)
    {
        // Basic error and size checks
        if ($f['error'] !== UPLOAD_ERR_OK) {
            return ['error' => "Erro ao fazer upload."];
        }
        if ($f['size'] > ($options['max_size'] ?? (5 * 1024 * 1024))) {
            return ['error' => "Arquivo excede limite de tamanho."];
        }
        $mimeType = mime_content_type($f['tmp_name']);
        $allowed = $options['allowed_mimes'] ?? ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($mimeType, $allowed)) {
            return ['error' => "Tipo de arquivo inválido."];
        }

        // Name: for banners: e.g. id-mobile, for products: random
        $baseName = $customName ?: uniqid();
        $result = [];

        // Load image resource
        $gd = match ($mimeType) {
            'image/jpeg' => imagecreatefromjpeg($f['tmp_name']),
            'image/png' => imagecreatefrompng($f['tmp_name']),
            'image/webp' => imagecreatefromwebp($f['tmp_name']),
            default => null
        };
        if (!$gd) return ['error' => "Falha ao processar imagem."];

        // Always create main webp
        $mainPath = "$targetDir/{$baseName}.webp";
        if (!imagewebp($gd, $mainPath, 80)) return ['error' => "Falha ao criar WebP."];
        $result['webp'] = self::publicPath($mainPath);

        // Optional resized variants (suffixes)
        foreach (($options['resize'] ?? []) as $r) {
            list($w, $h, $suf) = $r;
            $resized = self::resizeGD($gd, $w, $h);
            $path = "$targetDir/{$baseName}" . ($suf ? "$suf" : "") . ".webp";
            if (!imagewebp($resized, $path, 80)) {
                imagedestroy($resized);
                return ['error' => "Falha ao criar $suf para {$baseName}."];
            }
            $result["webp$suf"] = self::publicPath($path);
            imagedestroy($resized);
        }
        imagedestroy($gd);
        return $result;
    }

    /**
     * Resizes image to fit inside $w x $h box, keeping aspect ratio.
     */
    private static function resizeGD($gdSource, $maxW, $maxH)
    {
        $origW = imagesx($gdSource);
        $origH = imagesy($gdSource);
        $scale = min($maxW / $origW, $maxH / $origH, 1.0);
        $newW = max(1, (int)round($origW * $scale));
        $newH = max(1, (int)round($origH * $scale));
        $resized = imagecreatetruecolor($newW, $newH);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled($resized, $gdSource, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
        return $resized;
    }

    /**
     * Converts absolute path to public path (/images/...)
     */
    private static function publicPath($abs)
    {
        $base = defined('WEBSITE_ROOT') ? WEBSITE_ROOT : dirname(__DIR__, 2);
        return str_replace($base, '', $abs);
    }

    /**
     * Recursively deletes a folder and all its contents.
     *
     * @param string $folder Full path to the folder.
     * @return bool True if successful, False otherwise.
     */
    public static function deleteFolderRecursive(string $folder): bool
    {
        if (!is_dir($folder)) return false;

        $files = array_diff(scandir($folder), ['.', '..']);

        foreach ($files as $file) {
            $filePath = "$folder/$file";
            if (is_dir($filePath)) {
                if (!self::deleteFolderRecursive($filePath)) return false;
            } else {
                if (!unlink($filePath)) return false;
            }
        }

        return rmdir($folder);
    }
}
