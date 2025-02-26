using frontend.Constants;
using frontend.DTOs;
using frontend.Handlers;
using frontend.Helpers;
using Microsoft.AspNetCore.Components.Forms;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
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

        public ProductImageService(HttpClient httpClient, NotificationService notificationService)
        {
            _httpClient = httpClient;
            _notificationService = notificationService;
        }

        public async Task<List<ProductImageDto>?> GetImagesForProductId(int productId)
        {
            //FetchProductImages = new ApiStateHandler<List<ProductImageDto>>(
            //    () => _httpClient.GetAsync(ApiRoutes.Public.Products.Images.GetForProductId(productId)));

            await FetchProductImages.ExecuteAsync(GetImagesForProductIdFunc(productId));

            if (FetchProductImages.IsSuccess() && FetchProductImages.Content != null)
            {
                return FetchProductImages.Content;
            }

            return null;
        }

        public Func<Task<HttpResponseMessage>> GetImagesForProductIdFunc(int productId)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.Images.GetForProductId(productId));
        }

        //public async Task<List<ProductImageDto>?> UploadFileToServer(IBrowserFile file, int productId, int? variantId = null)
        //{
        //    UploadProductImage = new ApiStateHandler<object>(
        //        async () =>
        //        {
        //            using var content = new MultipartFormDataContent();
        //            using var fileStream = file.OpenReadStream(maxAllowedSize: MaxFileSize);
        //            using var streamContent = new StreamContent(fileStream);
        //            streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

        //            // The second parameter "file" is the form field name on the server side
        //            content.Add(streamContent, "file", file.Name);
        //            HttpResponseMessage response;

        //            if (variantId == null)
        //            {
        //                response = await _httpClient.PostAsync(ApiRoutes.Manage.Products.Images.UploadImageForProductId(productId), content);
        //            }
        //            else
        //            {
        //                response = await _httpClient.PostAsync(ApiRoutes.Manage.Products.Variants.Images.UploadImageForVariantId(productId, variantId ?? 0), content);
        //            }
        //            return response;
        //        });

        //    await UploadProductImage.ExecuteAsync();

        //    if (UploadProductImage.IsSuccess())
        //    {
        //        return await GetImagesForProductId(productId);
        //    }

        //    return null;
        //}

        //public async Task UploadFilesToServerAsync(IReadOnlyList<IBrowserFile> files, int productId, int? variantId = null)
        //{


        //    foreach (var file in files)
        //    {
        //        // Check MIME type against allowed types
        //        if (!IsValidImageType(file))
        //        {
        //            _notificationService.DisplayError($"Ignorado aquivo inválido: {file.Name}");
        //            continue; // Skip invalid files
        //        }

        //        await UploadFileToServer(file, productId, variantId);
        //    }
        //}

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

        // Helper method to check file type
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

        public Func<Task<HttpResponseMessage>> UpdateOrderingFunc(List<ProductImagePriorityDto> productImagePriorityDtoList)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Manage.ProductImages.UpdateOrdering,
                productImagePriorityDtoList,
                JsonHelper._options);
        }


        public Func<Task<HttpResponseMessage>> DeleteImageFunc(int imageId)
        {
            return () => _httpClient.DeleteAsync(ApiRoutes.Manage.ProductImages.Delete(imageId));
        }



        /// <summary>
        /// Uploads the provided file to the server, where it will be converted to WebP.
        /// </summary>
        /// <param name="productId">The product ID to associate the image with.</param>
        /// <param name="file">The image file selected by the user.</param>
        /// <returns>True if the upload succeeded, false otherwise.</returns>
        //public async Task<HttpResponseMessage?> UploadFileToServer(IBrowserFile file, int productId, int? variantId = null)
        //{
        //    using var content = new MultipartFormDataContent();
        //    using var fileStream = file.OpenReadStream(maxAllowedSize: MaxFileSize);
        //    using var streamContent = new StreamContent(fileStream);
        //    streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

        //    // The second parameter "file" is the form field name on the server side
        //    content.Add(streamContent, "file", file.Name);

        //    HttpResponseMessage response;

        //    if (variantId == null)
        //    {
        //        response = await _httpClient.PostAsync(ApiRoutes.Manage.Products.Images.UploadImageForProductId(productId), content);
        //    }
        //    else
        //    {
        //        response = await _httpClient.PostAsync(ApiRoutes.Manage.Products.Variants.Images.UploadImageForVariantId(productId, variantId ?? 0), content);
        //    }

        //    return response;
        //}

        //public async Task<List<ProductImageDto>?> GetImagesForProductId(int id)
        //{
        //    var response = await _httpClient.GetAsync(ApiRoutes.Public.Products.Images.GetForProductId(id));

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        // Return null to indicate an error or DB problem
        //        return null;
        //    }


        //    Console.WriteLine(await response.Content.ReadAsStringAsync());
        //    return await JsonHelper.Deserialize<List<ProductImageDto>>(response);
        //    //return await ApiServiceHelper.DeserializeResponse<List<ProductImageDto>>(response);
        //}

        //public async Task<List<ProductImageDto>?> GetImagesForProductVariantId(int variantId)
        //{
        //    var response = await _httpClient.GetAsync(
        //        ApiRoutes.Public.Products.Variants.Images.GetImagesForProductVariantId(variantId));

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        // Return null to indicate an error or DB problem
        //        return null;
        //    }


        //    Console.WriteLine(await response.Content.ReadAsStringAsync());
        //    return await JsonHelper.Deserialize<List<ProductImageDto>>(response);
        //    //return await ApiServiceHelper.DeserializeResponse<List<ProductImageDto>>(response);
        //}

        //public async Task DeleteImage(int imageId)
        //{
        //    DeleteProductImage = new(
        //        () => _httpClient.DeleteAsync(ApiRoutes.Manage.ProductImages.Delete(imageId)));

        //    await DeleteProductImage.ExecuteAsync();

        //    if (DeleteProductImage.HasFailed)
        //    {
        //        _notificationService.Display(DeleteProductImage.GetErrorNotificationModel("Falha na tentativa de deletar a imagem."));
        //        return;
        //    }

        //    _notificationService.DisplaySuccess("Imagem removida com sucesso!");



        //    //var response = await _httpClient.DeleteAsync(NewApiEndpoints.Manage.Product.Image.Delete(imageId));
        //    ////var response = await _httpClient.GetAsync(NewApiEndpoints.Manage.Product.);
        //    //Console.WriteLine("ProductImageService->Delete " + NewApiEndpoints.Manage.Product.Image.Delete(imageId));

        //    //if (!response.IsSuccessStatusCode)
        //    //{
        //    //    Console.WriteLine("ProductImageService->Delete 1");
        //    //    // Return null to indicate an error or DB problem
        //    //    return null;
        //    //}

        //    //Console.WriteLine("ProductImageService->Delete 2");
        //    //Console.WriteLine(await response.Content.ReadAsStringAsync());
        //    //return response;
        //    ////return await ApiServiceHelper.DeserializeResponse<List<ProductImageDto>>(response);
        //}

        //public async Task<HttpResponseMessage?> UpdateOrdering(List<ProductImageDto> productImageDtoList)
        //{
        //    List<ProductImagePriorityDto> productImagePriorityDtoList = [];

        //    foreach (var image in productImageDtoList)
        //    {
        //        productImagePriorityDtoList.Add(new ProductImagePriorityDto
        //        {
        //            Id = image.Id, 
        //            Priority = image.Priority
        //        });
        //    }

        //    var response = await _httpClient.PostAsJsonAsync(
        //        NewApiEndpoints.Manage.Product.Image.UpdateOrdering,
        //        JsonHelper.Serialize<List<ProductImagePriorityDto>>(productImagePriorityDtoList));

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        Console.WriteLine("ProductImageService->UpdateOrdering 1");
        //        // Return null to indicate an error or DB problem
        //        return null;
        //    }

        //    Console.WriteLine("ProductImageService->UpdateOrdering 2");
        //    Console.WriteLine(await response.Content.ReadAsStringAsync());
        //    return response;
        //}

        //public void NotifyProductImagesChanged()
        //{
        //    ProductImagesChanged?.Invoke();
        //}

        //public void NotifyProductVariantImagesChanged(int variantId)
        //{
        //    ProductVariantImagesChanged?.Invoke(variantId);
        //}
    }
}