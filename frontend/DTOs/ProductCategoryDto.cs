using System.ComponentModel.DataAnnotations;
using frontend.DTOs.Contracts;

namespace frontend.DTOs
{
    public record ProductCategoryDto
    {
        public int Id { get; set; } // Primary Key

        [Display(Name = "Nome")]
        public string Name { get; set; } = string.Empty; // ProductCategory Name

        [Display(Name = "Referência")]
        public string Reference { get; set; } = string.Empty; // Unique Reference

        [Display(Name = "Ativo")]
        public bool IsActive { get; set; } = true; // Whether the category is active
        public DateTime CreatedAt { get; set; } // Creation timestamp
        public DateTime UpdatedAt { get; set; } // Last updated timestamp

        public static class SortBy
        {
            public static readonly SortField Name = new("Name", c => c.Name);
            public static readonly SortField Reference = new("Reference", c => c.Reference);
            public static readonly SortField IsActive = new("Name", c => c.IsActive);

            public struct SortField
            {
                public string ColumnName { get; }
                public Func<ProductCategoryDto, object> Selector { get; }

                public SortField(string columnName, Func<ProductCategoryDto, object> selector)
                {
                    ColumnName = columnName;
                    Selector = selector;
                }
            }
        }

        //public IReadOnlyList<SortField> SortFields { get; } =
        //    new List<SortField>
        //    {
        //        new("Name", dto => ((ProductCategoryDto)dto).Name),
        //        new("Reference", dto => ((ProductCategoryDto)dto).Reference),
        //        new("IsActive", dto => ((ProductCategoryDto)dto).IsActive)
        //    };
    }

    public record NewProductCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string Reference { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}
