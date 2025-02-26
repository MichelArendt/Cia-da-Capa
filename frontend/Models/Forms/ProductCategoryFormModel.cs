using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Forms
{
    public class ProductCategoryFormModel
    {

        [Display(Name = "Título")]
        [Required(ErrorMessage = "Título é obrigatório.")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Referência")]
        [Required(ErrorMessage = "Referência é obrigatória")]
        public string Reference { get; set; } = string.Empty;

        [Display(Name = "Ativo")]
        [Required(ErrorMessage = "Ativo é obrigatório")]
        public bool IsActive { get; set; } = true;
    }
}
