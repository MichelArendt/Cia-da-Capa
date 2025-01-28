using System.ComponentModel.DataAnnotations;

namespace frontend.DTOs
{
    public record ProductSizeLabelDto
    {
        public int Id { get; set; }

        [Display(Name = "Título")]
        public string Title { get; set; } = string.Empty;

        [Display(Name = "Etiqueta")]
        public string Label { get; set; } = string.Empty;

        [Display(Name = "Criado em")]
        public DateTime CreatedAt { get; set; }

        [Display(Name = "Atualizado em")]
        public DateTime UpdatedAt { get; set; }
    }
}
