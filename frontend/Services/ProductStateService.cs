using frontend.DTOs;
using frontend.Handlers;
using frontend.Services.API;

namespace frontend.Services
{
    public class ProductStateService
    {
        public ApiStateHandler<ProductCategoryDto> Categories { get; }
        public ApiStateHandler<ProductSizeLabelDto> SizeLabels { get; }

        public ProductStateService(ProductCategoryService categoryService, ProductSizeLabelService sizeLabelService)
        {
            Categories = new ApiStateHandler<ProductCategoryDto>(categoryService.GetProductCategoriesAsync);
            SizeLabels = new ApiStateHandler<ProductSizeLabelDto>(sizeLabelService.GetProductSizeLabelsAsync);
        }
    }
}
