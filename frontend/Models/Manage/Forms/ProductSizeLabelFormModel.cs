using frontend.DTOs;
using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Manage.Forms
{
    public class ProductSizeLabelFormModel
    {
        public int Id { get; set; }

        [Display(Name = "Título do Rótulo de Tamanho")]
        [Required(ErrorMessage = "Título é obrigatório.")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Rótulo de Tamanho")]
        [Required(ErrorMessage = "Rótulo é obrigatório.")]
        [MinLength(1, ErrorMessage = "O rótulo deve ter pelo menos 1 caractere.")]
        public string Label { get; set; } = string.Empty;

        public void FromDto(ProductSizeLabelDto dto)
        {
            Id = dto.Id;
            Title = dto.Title;
            Label = dto.Label;
        }
    }
}
