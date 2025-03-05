using System.ComponentModel.DataAnnotations;

namespace frontend.DTOs
{
    public record ProductCategoryDto
    {
        public int Id { get; set; } // Primary Key

        [Display(Name = "Título")]
        public string Title { get; set; } = string.Empty; // ProductCategory Title

        [Display(Name = "Reference")]
        public string Reference { get; set; } = string.Empty; // Unique Reference

        [Display(Name = "Ativo")]
        public bool IsActive { get; set; } = true; // Whether the category is active
        public DateTime CreatedAt { get; set; } // Creation timestamp
        public DateTime UpdatedAt { get; set; } // Last updated timestamp

        //public static class SortBy
        //{
        //    public static readonly SortField Title = new("Title", c => c.Title);
        //    public static readonly SortField Reference = new("Reference", c => c.Reference);
        //    public static readonly SortField IsActive = new("IsActive", c => c.IsActive);

        //    public struct SortField
        //    {
        //        public string ColumnName { get; }
        //        public Func<ProductCategoryDto, object> Selector { get; }

        //        public SortField(string columnName, Func<ProductCategoryDto, object> selector)
        //        {
        //            ColumnName = columnName;
        //            Selector = selector;
        //        }
        //    }
        //}
    }

    public record NewProductCategoryDto
    {
        public string Title { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public record UpdateProductCategoryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
