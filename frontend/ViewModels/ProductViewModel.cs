using frontend.DTOs;
using frontend.Handlers;
using frontend.Services.API;

namespace frontend.ViewModels
{
    public class ProductViewModel
    {
        public ProductDto Details { get; set; } // Main product data
        public ApiStateHandler<ProductSizeDto>? Sizes { get; set; }
        public ApiStateHandler<ProductVariantDto>? Variants { get; set; }
        public ApiStateHandler<ProductImageDto>? Images { get; set; }

        //public bool IsLoadingProduct { get; set; } = false;
        //public bool IsLoadingSizes { get; set; } = false;
        //public bool IsLoadingImages { get; set; } = false;
        //public bool IsLoadingVariants { get; set; } = false;

        public string? ErrorMessage { get; set; }
        private ProductService _productService;
        private ProductVariantService _productVariantService;
        private ProductImageService _productImageService;

        public ProductViewModel(
            ProductDto productDto, 
            ProductService productService,
            ProductVariantService productVariantService,
            ProductImageService productImageService) 
        {
            Details = productDto;
            _productService = productService;
            _productVariantService = productVariantService;
            _productImageService = productImageService;
        }

        public async Task LoadDetailsAsync()
        {
            Variants = new ApiStateHandler<ProductVariantDto>(
                async () => await _productVariantService.GetVariantForProductId(this.Details.Id));
            Images = new ApiStateHandler<ProductImageDto>(
                async () => await _productImageService.GetImagesForProductId(this.Details.Id));

            await Task.WhenAll(
                Variants.FetchItems(),
                Images.FetchItems()
            );

            //Console.WriteLine("Images.Items.Count(): " + Images.Items.Count());
            //Console.WriteLine("Images.State: " + Images.State);

            //foreach (var item in Images.Items)
            //{
            //    Console.WriteLine("-------------------------");
            //    Console.WriteLine(item.Id);
            //    Console.WriteLine(item.FilePath);
            //    Console.WriteLine(item.MediumFilePath);
            //    Console.WriteLine(item.ThumbnailFilePath);
            //    Console.WriteLine(item.CreatedAt);
            //}
        }

        public async Task LoadImagesAsync()
        {
            Images = new ApiStateHandler<ProductImageDto>(
                async () => await _productImageService.GetImagesForProductId(this.Details.Id));

            await Images.FetchItems();

            Images.Reorder(im => im.Priority);
        }

        //public async Task LoadDetailsAsync()
        //{
        //    Variants = new ApiStateHandler<ProductVariantDto>(productImageService.FetchImagesById());
        //    Images = new ApiStateHandler<ProductImageDto>(productImageService.FetchImagesById());
        //}
    }
}
