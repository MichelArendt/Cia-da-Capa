using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace frontend.DTOs
{
    public record ProductImageDto
    {
        public int Id { get; set; }

        [Display(Name = "ID do Produto")]
        public int ProductId { get; set; }

        [Display(Name = "ID da Variante do Produto")]
        public int? ProductVariantId { get; set; }

        [Display(Name = "Caminho do Arquivo")]
        public string FilePath { get; set; } = string.Empty;

        [Display(Name = "Caminho do Arquivo thumbnail")]
        public string ThumbnailFilePath { get; set; } = string.Empty;

        [Display(Name = "Caminho do Arquivo médio")]
        public string MediumFilePath { get; set; } = string.Empty;

        [Display(Name = "Prioridade")]
        public int Priority { get; set; } = 0;

        [Display(Name = "Criado em")]
        public DateTime CreatedAt { get; set; }

        [Display(Name = "Atualizado em")]
        public DateTime UpdatedAt { get; set; }
    }
    public record ProductImagePriorityDto
    {
        public int Id { get; set; }

        public int Priority { get; set; }
    }
}
