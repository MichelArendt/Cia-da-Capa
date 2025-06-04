using frontend.DTOs;
using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Manage.Forms
{
    public class ProductCategoryFormModel
    {
        public int Id { get; set; }

        [Display(Name = "Título")]
        [Required(ErrorMessage = "Título é obrigatório.")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Referência")]
        [Required(ErrorMessage = "Referência é obrigatória")]
        public string Reference { get; set; } = string.Empty;

        [Display(Name = "Ativo")]
        [Required(ErrorMessage = "Ativo é obrigatório")]
        public bool IsActive { get; set; } = true;

        public void FromDto(ProductCategoryDto dto)
        {
            Id = dto.Id;
            Title = dto.Title;
            Reference = dto.Reference;
            IsActive = dto.IsActive;
        }
    }
}
