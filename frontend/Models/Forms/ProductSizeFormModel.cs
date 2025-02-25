using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Forms
{
    public class ProductSizeFormModel
    {
        [Display(Name = "ID do Rótulo de Tamanho")]
        public int SizeLabelId { get; set; }

        [Display(Name = "Largura (cm)")]
        [Required(ErrorMessage = "Largura é obrigatória.")]
        public float Width { get; set; }

        [Display(Name = "Altura (cm)")]
        [Required(ErrorMessage = "Altura é obrigatória.")]
        public float Height { get; set; }

        [Display(Name = "Profundidade (cm)")]
        [Required(ErrorMessage = "Profundidade é obrigatória.")]
        public float Depth { get; set; }
    }
}
