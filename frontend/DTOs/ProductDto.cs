using frontend.Models.Manage.Forms;

namespace frontend.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; } // Primary Key
        public string Title { get; set; } = string.Empty; // Product title
        public string Reference { get; set; } = string.Empty; // Unique Reference
        public string? Description { get; set; } // Product description (optional)

        public int CategoryId { get; set; } // Foreign Key (Category)
        public bool IsActive { get; set; } = true; // Active status
        public bool IsHighlighted { get; set; } = false; // Highlighted status
        public int? Priority { get; set; } = 0; // Sorting priority

        public DateTime CreatedAt { get; set; } // Creation timestamp
        public DateTime UpdatedAt { get; set; } // Last update timestamp

        public List<ProductSizeDto> Sizes { get; set; } = [];
        public List<ProductImageDto> Images { get; set; } = [];
        public List<ProductVariantDto> Variants { get; set; } = [];
    }

    public class ProductFormDto
    {

        public string Title { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsHighlighted { get; set; } = false;
        public int? Priority { get; set; } = 0;

        public ProductFormDto() { }

        public ProductFormDto(ProductFormModel productFormModel)
        {
            Title = productFormModel.Title;
            Reference = productFormModel.Reference;
            Description = productFormModel.Description;
            CategoryId = productFormModel.CategoryId;
            IsActive = productFormModel.IsActive;
            IsHighlighted = productFormModel.IsHighlighted;
            Priority = productFormModel.Priority;
        }

        public void FromProductFormModel(ProductFormModel productFormModel)
        {
            Title = productFormModel.Title;
            Reference = productFormModel.Reference;
            Description = productFormModel.Description;
            CategoryId = productFormModel.CategoryId;
            IsActive = productFormModel.IsActive;
            IsHighlighted = productFormModel.IsHighlighted;
            Priority = productFormModel.Priority;
        }
    }
}
