namespace frontend.DTOs
{
    public record ProductSizeLabelDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Label { get; set; } = string.Empty;
        public int Priority { get; set; } = 0;

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }

    public record NewProductSizeLabelDto
    {
        public string Title { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
    }

    public record UpdateProductSizeLabelOrderingDto
    {
        public int Id { get; set; }
        public int Priority { get; set; }
    }
}
