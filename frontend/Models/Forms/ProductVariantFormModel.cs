using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Forms
{
    public class ProductVariantFormModel
    {
        [Required(ErrorMessage = "Referência é obrigatória.")]
        public string Reference { get; set; } = string.Empty;

        [Required(ErrorMessage = "Título é obrigatório.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Descrição é obrigatória.")]
        public string Description { get; set; } = string.Empty;
    }
}
