using System.ComponentModel.DataAnnotations;

namespace frontend.DTOs
{
    public record ProductVariantDto
    {
        public int Id { get; set; }

        [Display(Name = "ID do Produto")]
        public int ProductId { get; set; }

        [Display(Name = "Nome da Variante")]
        public string VariantName { get; set; } = string.Empty;

        [Display(Name = "Criado em")]
        public DateTime CreatedAt { get; set; }

        [Display(Name = "Atualizado em")]
        public DateTime UpdatedAt { get; set; }

        public List<ProductImageDto> Images { get; set; } = [];
    }
}
