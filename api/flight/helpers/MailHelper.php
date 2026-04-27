<?php

namespace Helpers;

use Flight;
use Helpers\Logger;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../lib/phpmailer/src/Exception.php';
require_once __DIR__ . '/../lib/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../lib/phpmailer/src/SMTP.php';

class MailHelper
{
    public static function sendContactEmail(
        string $givenName,
        string $familyName,
        string $email,
        string $phone,
        string $message
    ): bool {
        $mail = new PHPMailer(true);

        try {
            $fromEmail = getenv('MAIL_FROM');
            $fromName = self::cleanHeaderText(getenv('MAIL_FROM_NAME') ?: 'Cia da Capa');

            $fullName = self::cleanHeaderText($givenName . ' ' . $familyName);
            $cleanEmail = self::cleanHeaderText($email);
            $cleanPhone = self::cleanHeaderText($phone, 40);
            $cleanMessage = self::cleanPlainText($message);

            if (!filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
                Logger::error('Mail config error: MAIL_FROM is invalid.');
                return false;
            }

            $mail->isSMTP();
            $mail->Host = getenv('MAIL_HOST');
            $mail->SMTPAuth = true;
            $mail->Username = getenv('MAIL_USERNAME');
            $mail->Password = getenv('MAIL_PASSWORD');
            $mail->Port = (int) getenv('MAIL_PORT');

            // Port 465 usually uses SSL. Port 587 usually uses TLS.
            $mail->SMTPSecure = getenv('MAIL_ENCRYPTION') === 'ssl'
                ? PHPMailer::ENCRYPTION_SMTPS
                : PHPMailer::ENCRYPTION_STARTTLS;

            $mail->CharSet = 'UTF-8';

            // The sender must be your authenticated domain email to avoid SPF/DKIM issues.
            $mail->setFrom($fromEmail, $fromName);

            // In this setup, the site email also receives the contact messages.
            $mail->addAddress($fromEmail);

            // Replying to the received email will answer the visitor directly.
            if (filter_var($cleanEmail, FILTER_VALIDATE_EMAIL)) {
                $mail->addReplyTo($cleanEmail, $fullName);
            }

            $safeName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
            $safeEmail = htmlspecialchars($cleanEmail, ENT_QUOTES, 'UTF-8');
            $safePhone = htmlspecialchars($cleanPhone, ENT_QUOTES, 'UTF-8');
            $safeMessage = nl2br(htmlspecialchars($cleanMessage, ENT_QUOTES, 'UTF-8'));

            $mail->isHTML(true);
            $mail->Subject = "Nova mensagem pelo site - {$safeName}";

            $mail->Body = "
                <h2>Nova mensagem pelo site</h2>
                <p><strong>Nome:</strong> {$safeName}</p>
                <p><strong>Email:</strong> {$safeEmail}</p>
                <p><strong>Telefone:</strong> {$safePhone}</p>
                <p><strong>Mensagem:</strong></p>
                <p>{$safeMessage}</p>
            ";

            // Plain-text fallback for email clients that do not render HTML.
            $mail->AltBody =
                "Nova mensagem pelo site\n\n" .
                "Nome: {$fullName}\n" .
                "Email: {$cleanEmail}\n" .
                "Telefone: {$cleanPhone}\n\n" .
                "Mensagem:\n{$cleanMessage}";

            return $mail->send();
        } catch (Exception $e) {
            Logger::error('Mail error: ' . $mail->ErrorInfo);
            return false;
        }
    }

    private static function cleanHeaderText(string $value, int $maxLength = 120): string
    {
        // Prevent header injection by removing CR/LF and other control characters.
        $value = preg_replace('/[\r\n\x00-\x1F\x7F]+/', ' ', $value);
        $value = trim(preg_replace('/\s+/', ' ', $value));

        return mb_substr($value, 0, $maxLength);
    }

    private static function cleanPlainText(string $value, int $maxLength = 5000): string
    {
        // Keep line breaks readable, but remove dangerous/control characters.
        $value = str_replace(["\r\n", "\r"], "\n", $value);
        $value = preg_replace('/[^\P{C}\n\t]+/u', '', $value);
        $value = preg_replace("/\n{3,}/", "\n\n", $value);

        return trim(mb_substr($value, 0, $maxLength));
    }
}
