using System.ComponentModel.DataAnnotations;

namespace frontend.DTOs
{
    public record ProductSizeDto
    {
        public int Id { get; set; }

        [Display(Name = "ID do Produto")]
        public int ProductId { get; set; }

        [Display(Name = "ID do Rótulo de Tamanho")]
        public int SizeLabelId { get; set; }

        [Display(Name = "Largura (cm)")]
        public float Width { get; set; }

        [Display(Name = "Altura (cm)")]
        public float Height { get; set; }

        [Display(Name = "Profundidade (cm)")]
        public float Depth { get; set; }

        [Display(Name = "Criado em")]
        public DateTime CreatedAt { get; set; }

        [Display(Name = "Atualizado em")]
        public DateTime UpdatedAt { get; set; }
    }
}
