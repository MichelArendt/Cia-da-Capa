namespace frontend.DTOs
{
    public record ProductCategoryDto
    {
        public int Id { get; set; } // Primary Key
        public string Name { get; set; } = string.Empty; // ProductCategory Name
        public string Reference { get; set; } = string.Empty; // Unique Reference
        public bool IsActive { get; set; } = true; // Whether the category is active
        public DateTime CreatedAt { get; set; } // Creation timestamp
        public DateTime UpdatedAt { get; set; } // Last updated timestamp
    }
    public record NewProductCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
