using frontend.DTOs;
using frontend.Services;

namespace frontend.ViewModels
{
    public class ProductLookupViewModel
    {
        public int Id { get; set; }
        public string Reference { get; set; } = "";
        public string Title { get; set; } = "";
        public string CategoryTitle { get; set; } = "";
        public string CategoryReference { get; set; } = "";

        public string FullReference { get; set; } = "";

        public bool IsActive { get; set; }
        public bool IsHighlighted { get; set; }
        public int? Priority { get; set; }

        // For searching by multiple fields, a simple helper:
        public string SearchString => $"{FullReference} {CategoryTitle} {Title}".ToLowerInvariant();

        /// <summary>
        /// Creates a ProductLookupViewModel from a ProductDto, using the state service for category info.
        /// </summary>
        public static ProductLookupViewModel FromDto(ProductDto dto, ProductStateService productStateService)
        {
            var category = productStateService.CategoriesDict.TryGetValue(dto.CategoryId, out var cat) ? cat : null;
            var fullReference = productStateService.GetProductFullReference(dto);

            return new ProductLookupViewModel
            {
                Id = dto.Id,
                Reference = dto.Reference,
                Title = dto.Title,
                CategoryTitle = category?.Title ?? "",
                CategoryReference = category?.Reference ?? "",
                FullReference = fullReference,
                IsActive = dto.IsActive,
                IsHighlighted = dto.IsHighlighted,
                Priority = dto.Priority
            };
        }
    }
}
