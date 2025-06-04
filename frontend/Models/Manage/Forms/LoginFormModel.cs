using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Manage.Forms
{
    public class LoginFormModel
    {

        [Display(Name = "Usuário")]
        [Required(ErrorMessage = "Usuário é obrigatório.")]
        public string Username { get; set; } = string.Empty;

        [Display(Name = "Senha")]
        [Required(ErrorMessage = "Senha é obrigatória.")]
        public string Password { get; set; } = string.Empty;
    }
}
