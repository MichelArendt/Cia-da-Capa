using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Forms
{
    public class ProductSizeLabelFormModel
    {
        [Display(Name = "Título do Rótulo de Tamanho")]
        [Required(ErrorMessage = "Título é obrigatório.")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Rótulo de Tamanho")]
        [Required(ErrorMessage = "Rótulo é obrigatório.")]
        public string Label { get; set; } = string.Empty;
    }
}
