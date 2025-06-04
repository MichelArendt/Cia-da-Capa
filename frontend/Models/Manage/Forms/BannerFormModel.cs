using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Manage.Forms
{
    public class BannerFormModel
    {
        [Required(ErrorMessage = "O título é obrigatório.")]
        public string? Title { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "A prioridade deve ser zero ou maior.")]
        public int Priority { get; set; }
    }
}
