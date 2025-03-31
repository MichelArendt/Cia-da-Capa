namespace frontend.DTOs
{
    public record ProductSizeDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int SizeLabelId { get; set; }
        public float Width { get; set; }
        public float Height { get; set; }
        public float Depth { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
    public record NewProductSizeDto
    {
        public int ProductId { get; set; }
        public int SizeLabelId { get; set; }
        public float Width { get; set; }
        public float Height { get; set; }
        public float Depth { get; set; }
    }
    public record UpdateProductSizeDto
    {
        public int Id { get; set; }
        public int SizeLabelId { get; set; }
        public float Width { get; set; }
        public float Height { get; set; }
        public float Depth { get; set; }
    }
}
