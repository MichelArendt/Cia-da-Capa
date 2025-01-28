using System.ComponentModel.DataAnnotations;

namespace frontend.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; } // Primary Key

        [Display(Name = "Título")]
        public string Title { get; set; } = string.Empty; // Product title

        [Display(Name = "Referência")]
        public string Reference { get; set; } = string.Empty; // Unique Reference

        [Display(Name = "Descrição")]
        public string? Description { get; set; } // Product description (optional)

        public int CategoryId { get; set; } // Foreign Key (Category)

        [Display(Name = "Ativo")]
        public bool IsActive { get; set; } = true; // Active status

        [Display(Name = "Destacado")]
        public bool IsHighlighted { get; set; } = false; // Highlighted status

        [Display(Name = "Prioridade")]
        public int? Priority { get; set; } = 0; // Sorting priority

        public DateTime CreatedAt { get; set; } // Creation timestamp
        public DateTime UpdatedAt { get; set; } // Last update timestamp
    }
    public class NewProductDto
    {
        public string Title { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsHighlighted { get; set; } = false;
        public int? Priority { get; set; } = 0;
    }
}
