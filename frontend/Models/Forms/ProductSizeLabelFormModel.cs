using frontend.DTOs;
using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Forms
{
    public class ProductSizeLabelFormModel
    {
        public int Id { get; set; }
        [Display(Name = "Título do Rótulo de Tamanho")]
        [Required(ErrorMessage = "Título é obrigatório.")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Rótulo de Tamanho")]
        [Required(ErrorMessage = "Rótulo é obrigatório.")]
        public string Label { get; set; } = string.Empty;

        public void FromDto(ProductSizeLabelDto dto)
        {
            Id = dto.Id;
            Title = dto.Title;
            Label = dto.Label;
        }
    }
}
