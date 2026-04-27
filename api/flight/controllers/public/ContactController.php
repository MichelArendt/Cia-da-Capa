<?php

namespace Controllers\Public;

use Exception;
use Flight;
use Helpers\HttpResponse;
use Helpers\Logger;
use Helpers\MailHelper;
use Helpers\TurnstileHelper;

class ContactController
{
    public function submit()
    {
        try {
            $requestBody = Flight::request()->getBody();
            $payload = json_decode($requestBody, true);

            if (!is_array($payload)) {
                HttpResponse::returnValidationError("Requisição inválida.");
            }

            $givenName = trim($payload['given_name'] ?? '');
            $familyName = trim($payload['family_name'] ?? '');
            $email = trim($payload['email'] ?? '');
            $phone = trim($payload['tel'] ?? '');
            $message = trim($payload['message'] ?? '');
            $captchaToken = trim($payload['captcha_token'] ?? '');
            $website = trim($payload['website'] ?? '');

            // Logger::info("givenName=[$givenName], familyName=[$familyName], email=[$email], phone=[$phone], message=[$message], captchaToken=[$captchaToken], website=[$website]");

            // Honeypot
            if ($website !== '') {
                HttpResponse::returnValidationError("Envio inválido.");
            }

            if (
                $givenName === '' ||
                $familyName === '' ||
                $email === '' ||
                $phone === '' ||
                $message === ''
            ) {
                HttpResponse::returnValidationError("Os campos obrigatórios devem ser preenchidos.");
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                HttpResponse::returnValidationError("O email informado é inválido.");
            }

            if ($captchaToken === '') {
                HttpResponse::returnValidationError("A verificação de segurança é obrigatória.");
            }

            $remoteIp = $_SERVER['REMOTE_ADDR'] ?? null;
            $turnstileResult = TurnstileHelper::verify($captchaToken, $remoteIp);

            if (!$turnstileResult['success']) {
                Logger::error(
                    'Turnstile rejected contact submission. Error codes: ' .
                        implode(', ', $turnstileResult['error_codes'])
                );

                HttpResponse::returnValidationError("Falha na verificação de segurança. Tente novamente.");
            }

            $emailSent = MailHelper::sendContactEmail(
                $givenName,
                $familyName,
                $email,
                $phone,
                $message
            );

            if (!$emailSent) {
                HttpResponse::returnValidationError(
                    "Não foi possível enviar a mensagem. Tente novamente."
                );
            }

            HttpResponse::responseCreateSuccess(
                "Mensagem enviada com sucesso.",
                [
                    'sent' => true
                ]
            );
        } catch (Exception $e) {
            HttpResponse::handleException($e, __METHOD__, "ContactController->submit()");
        }
    }
}
