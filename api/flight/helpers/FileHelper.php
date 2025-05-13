<?php

namespace Helpers;

class FileHelper
{
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