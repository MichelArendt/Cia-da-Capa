using frontend.DTOs;
using System.ComponentModel.DataAnnotations;

namespace frontend.Models.Manage.Forms
{
    public class ProductFormModel
    {

        [Display(Name = "Título")]
        [Required(ErrorMessage = "Título é obrigatório.")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Reference")]
        [Required(ErrorMessage = "Referência é obrigatória.")]
        public string Reference { get; set; } = string.Empty;

        [Display(Name = "Descrição")]

        public string? Description { get; set; }

        [Required(ErrorMessage = "Categoria é obrigatória.")]
        [Range(1, int.MaxValue, ErrorMessage = "Selecione uma categoria válida.")]
        public int CategoryId { get; set; }

        [Display(Name = "Ativo")]

        public bool IsActive { get; set; } = true;

        [Display(Name = "Destacado")]
        public bool IsHighlighted { get; set; } = false;

        [Display(Name = "Prioridade")]

        public int? Priority { get; set; } = 0;

        public ProductFormModel() { }

        public ProductFormModel(ProductDto productDto)
        {
            Title = productDto.Title;
            Reference = productDto.Reference;
            CategoryId = productDto.CategoryId;
            Description = productDto.Description;
            IsActive = productDto.IsActive;
            IsHighlighted = productDto.IsHighlighted;
            Priority = productDto.Priority;
        }

        public ProductDto ToProductDto(int id = 0)
        {
            return new ProductDto
            {
                Id = id,
                Title = Title,
                Reference = Reference,
                CategoryId = CategoryId,
                Description = Description,
                IsActive = IsActive,
                IsHighlighted = IsHighlighted,
                Priority = Priority ?? 0
            };
        }
    }
}
