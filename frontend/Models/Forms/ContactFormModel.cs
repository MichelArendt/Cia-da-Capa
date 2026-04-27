using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Forms
{
    public class ContactFormModel
    {
        [Display(Name = "Nome")]
        [Required(ErrorMessage = "Nome é obrigatório.")]
        public string GivenName { get; set; } = string.Empty;

        [Display(Name = "Sobrenome")]
        [Required(ErrorMessage = "Sobrenome é obrigatório.")]
        public string FamilyName { get; set; } = string.Empty;

        [Display(Name = "Email")]
        [Required(ErrorMessage = "Email é obrigatório.")]
        [EmailAddress(ErrorMessage = "Formato de email inválido.")]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Email incompleto.")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "Telefone")]
        [Required(ErrorMessage = "Telefone é obrigatório.")]
        [RegularExpression(@"^\(\d{2}\)\s(\d-\d{4}-\d{4}|\d{4}-\d{4})$", ErrorMessage = "Formato inválido. Use (xx) xxxx-xxxx ou (xx) xxxxx-xxxx.")]
        public string Tel { get; set; } = string.Empty;

        [Display(Name = "Mensagem")]
        [Required(ErrorMessage = "Mensagem é obrigatória.")]
        public string Message { get; set; } = string.Empty;


        // CAPTCHA token returned by Turnstile/reCAPTCHA
        [Required(ErrorMessage = "CAPTCHA é obrigatória.")]
        public string CaptchaToken { get; set; } = string.Empty;

        // Honeypot field - should stay empty
        public string Website { get; set; } = string.Empty;
    }
}
