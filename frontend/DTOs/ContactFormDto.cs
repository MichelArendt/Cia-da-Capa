namespace frontend.DTOs
{
    public class ContactFormDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;

        // CAPTCHA token returned by Turnstile/reCAPTCHA
        public string CaptchaToken { get; set; } = string.Empty;

        // Honeypot field - should stay empty
        public string Website { get; set; } = string.Empty;
    }
}
