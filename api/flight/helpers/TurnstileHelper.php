<?php

namespace Helpers;

use Helpers\Logger;

class TurnstileHelper
{
    /**
     * Verify a Turnstile token with Cloudflare.
     *
     * @param string $token
     * @param string|null $remoteIp
     * @return array{
     *     success: bool,
     *     error_codes: array,
     *     hostname: ?string
     * }
     */
    public static function verify(string $token, ?string $remoteIp = null): array
    {
        $secretKey = $_ENV['TURNSTILE_SECRET_KEY'] ?? '';

        if (empty($secretKey) || empty($token)) {
            return [
                'success' => false,
                'error_codes' => ['missing-input'],
                'hostname' => null,
            ];
        }

        $payload = [
            'secret' => $secretKey,
            'response' => $token,
        ];

        if (!empty($remoteIp)) {
            $payload['remoteip'] = $remoteIp;
        }

        $curl = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');

        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($payload),
            CURLOPT_TIMEOUT => 15,
        ]);

        $response = curl_exec($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $curlError = curl_error($curl);

        curl_close($curl);

        if ($response === false || $httpCode < 200 || $httpCode >= 300) {
            Logger::error('Turnstile verification request failed. HTTP: ' . $httpCode . ' CURL: ' . $curlError);

            return [
                'success' => false,
                'error_codes' => ['verification-request-failed'],
                'hostname' => null,
            ];
        }

        $decoded = json_decode($response, true);

        if (!is_array($decoded)) {
            Logger::error('Turnstile invalid JSON response: ' . $response);

            return [
                'success' => false,
                'error_codes' => ['invalid-json-response'],
                'hostname' => null,
            ];
        }

        $success = (bool)($decoded['success'] ?? false);

        // Log ONLY failures
        if (!$success) {
            Logger::error('Turnstile failed: ' . json_encode([
                'error_codes' => $decoded['error-codes'] ?? [],
                'hostname' => $decoded['hostname'] ?? null,
            ]));
        }

        return [
            'success' => (bool)($decoded['success'] ?? false),
            'error_codes' => $decoded['error-codes'] ?? [],
            'hostname' => $decoded['hostname'] ?? null,
        ];
    }
}
