<?php

namespace Helpers;

class ValidationHelper
{
    public static function checkRequiredFields(array $data, array $requiredFields): ?string
    {
        $missingFields = [];

        foreach ($requiredFields as $field => $label) {
            if (empty($data[$field])) {
                $missingFields[] = $label;
            }
        }

        if (!empty($missingFields)) {
            return "Os seguintes campos são obrigatórios: " . implode(', ', $missingFields);
        }

        return null; // No errors
    }
}
