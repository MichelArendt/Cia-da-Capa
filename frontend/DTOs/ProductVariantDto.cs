using System.ComponentModel.DataAnnotations;

namespace frontend.DTOs
{
    public record ProductVariantDto
    {
        public int Id { get; set; }

        [Display(Name = "ID do Produto")]
        public int ProductId { get; set; }

        [Display(Name = "Reference")]
        public string Reference { get; set; } = string.Empty;

        [Display(Name = "Título")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Descrição")]
        public string Description { get; set; } = string.Empty;

        [Display(Name = "Criado em")]
        public DateTime CreatedAt { get; set; }

        [Display(Name = "Atualizado em")]
        public DateTime UpdatedAt { get; set; }

        public List<ProductImageDto> Images { get; set; } = [];
    }
    public record NewProductVariantDto
    {

        public int ProductId { get; set; }

        public string Reference { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}
