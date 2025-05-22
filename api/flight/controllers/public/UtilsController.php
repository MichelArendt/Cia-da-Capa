<?php

namespace Controllers\Public;

use Helpers\HttpResponse;

class UtilsController
{
    public function getClientLogos()
    {
        $folder = $_SERVER['DOCUMENT_ROOT'] . '/images/clients';

        if (!is_dir($folder)) {
            HttpResponse::triggerError(
                "Pasta de imagens dos clientes não foi encontrada: $folder",
                 __METHOD__,
                "Pasta de imagens dos clientes não foi encontrada: $folder");
        }

        // Supported image extensions
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $images = [];

        foreach (scandir($folder) as $file) {
            $filePath = $folder . '/' . $file;

            if (is_file($filePath)) {
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($extension, $allowedExtensions)) {
                    $images[] = '/images/clients/' . $file; // relative path for frontend use
                }
            }
        }

        HttpResponse::responseFetchSuccess($images);
    }
}
