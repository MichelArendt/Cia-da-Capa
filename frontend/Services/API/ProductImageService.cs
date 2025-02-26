using frontend.Constants;
using frontend.DTOs;
using frontend.Handlers;
using frontend.Helpers;
using Microsoft.AspNetCore.Components.Forms;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    /// <summary>
    /// Service to manage product images, including fetching, uploading, and deleting images.
    /// </summary>
    public class ProductImageService
    {
        public int? ProductId { get; private set; }
        public int? VariantId { get; private set; }
        public event Func<Task>? ProductImagesChanged;
        public event Func<int, Task>? ProductVariantImagesChanged;
        public static readonly long MaxFileSize = 5 * 1024 * 1024;

        public ApiStateHandler<List<ProductImageDto>> FetchProductImages { get; private set; } = new();
        public ApiStateHandler<object> UploadProductImage { get; private set; } = default!;
        public ApiStateHandler<object> DeleteProductImage { get; private set; } = default!;

        private readonly HttpClient _httpClient;
        private readonly NotificationService _notificationService;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProductImageService"/> class.
        /// </summary>
        /// <param name="httpClient">The HTTP client instance.</param>
        /// <param name="notificationService">The notification service instance.</param>
        public ProductImageService(HttpClient httpClient, NotificationService notificationService)
        {
            _httpClient = httpClient;
            _notificationService = notificationService;
        }

        /// <summary>
        /// Fetches images for a given product ID.
        /// </summary>
        /// <param name="productId">The product ID.</param>
        /// <returns>A list of product images or null if the fetch fails.</returns>
        public async Task<List<ProductImageDto>?> GetImagesForProductId(int productId)
        {
            await FetchProductImages.ExecuteAsync(GetImagesForProductIdFunc(productId));

            if (FetchProductImages.IsSuccess() && FetchProductImages.Content != null)
            {
                return FetchProductImages.Content;
            }

            return null;
        }

        /// <summary>
        /// Returns a function to fetch images for a given product ID.
        /// </summary>
        /// <param name="productId">The product ID.</param>
        /// <returns>A function that fetches images for the product ID.</returns>
        public Func<Task<HttpResponseMessage>> GetImagesForProductIdFunc(int productId)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.Images.GetForProductId(productId));
        }

        /// <summary>
        /// Uploads files to the server for a given product and optional variant ID.
        /// </summary>
        /// <param name="files">The files to upload.</param>
        /// <param name="productId">The product ID.</param>
        /// <param name="variantId">The optional variant ID.</param>
        public async Task UploadFilesToServerAsync(IReadOnlyList<IBrowserFile> files, int productId, int? variantId = null)
        {
            using var content = new MultipartFormDataContent();
            var fileStreams = new List<(StreamContent, Stream)>(); // Store streams to dispose later

            try
            {
                foreach (var file in files)
                {
                    // Check MIME type against allowed types
                    if (!IsValidImageType(file))
                    {
                        _notificationService.DisplayError($"Ignorado arquivo inválido: {file.Name}");
                        continue; // Skip invalid files
                    }

                    // Open the file stream (DO NOT use `using` here)
                    var fileStream = file.OpenReadStream(maxAllowedSize: MaxFileSize);
                    var streamContent = new StreamContent(fileStream);
                    streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

                    // Add to form content
                    content.Add(streamContent, "files[]", file.Name);
                    fileStreams.Add((streamContent, fileStream)); // Store for later disposal
                }

                if (content.Count() == 0)
                {
                    _notificationService.DisplayError("Nenhum arquivo válido para upload.");
                    return;
                }

                // Upload all files in one request
                await UploadFilesToServer(productId, variantId, content);
            }
            finally
            {
                // Ensure all streams are closed after request is sent
                foreach (var (streamContent, fileStream) in fileStreams)
                {
                    streamContent.Dispose();
                    fileStream.Dispose();
                }
            }
        }

        /// <summary>
        /// Uploads files to the server for a given product and optional variant ID.
        /// </summary>
        /// <param name="productId">The product ID.</param>
        /// <param name="variantId">The optional variant ID.</param>
        /// <param name="content">The multipart form data content.</param>
        private async Task UploadFilesToServer(int productId, int? variantId, MultipartFormDataContent content)
        {
            UploadProductImage = new ApiStateHandler<object>(async () =>
            {
                HttpResponseMessage response = variantId == null
                    ? await _httpClient.PostAsync(ApiRoutes.Manage.Products.Images.UploadImageForProductId(productId), content)
                    : await _httpClient.PostAsync(ApiRoutes.Manage.Products.Variants.Images.UploadImageForVariantId(productId, variantId ?? 0), content);

                return response;
            });

            await UploadProductImage.ExecuteAsync();
        }

        /// <summary>
        /// Checks if the file type is a valid image type.
        /// </summary>
        /// <param name="file">The file to check.</param>
        /// <returns>True if the file type is valid, otherwise false.</returns>
        private bool IsValidImageType(IBrowserFile file)
        {
            var allowedTypes = new HashSet<string>
                {
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                };

            return allowedTypes.Contains(file.ContentType);
        }

        /// <summary>
        /// Returns a function to update the ordering of product images.
        /// </summary>
        /// <param name="productImagePriorityDtoList">The list of product image priorities.</param>
        /// <returns>A function that updates the ordering of product images.</returns>
        public Func<Task<HttpResponseMessage>> UpdateOrderingFunc(List<ProductImagePriorityDto> productImagePriorityDtoList)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Manage.ProductImages.UpdateOrdering,
                productImagePriorityDtoList,
                JsonHelper._options);
        }

        /// <summary>
        /// Returns a function to delete an image by its ID.
        /// </summary>
        /// <param name="imageId">The image ID.</param>
        /// <returns>A function that deletes the image.</returns>
        public Func<Task<HttpResponseMessage>> DeleteImageFunc(int imageId)
        {
            return () => _httpClient.DeleteAsync(ApiRoutes.Manage.ProductImages.Delete(imageId));
        }
    }
}