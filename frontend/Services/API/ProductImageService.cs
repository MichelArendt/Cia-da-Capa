using frontend.Constants;
using Microsoft.AspNetCore.Components.Forms;
using System.Net.Http.Headers;

namespace frontend.Services.API
{
    public class ProductImageService
    {
        private readonly HttpClient _httpClient;
        public static readonly long MaxFileSize = 5 * 1024 * 1024;

        public ProductImageService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /// <summary>
        /// Uploads the provided file to the server, where it will be converted to WebP.
        /// </summary>
        /// <param name="productId">The product ID to associate the image with.</param>
        /// <param name="file">The image file selected by the user.</param>
        /// <returns>True if the upload succeeded, false otherwise.</returns>
        public async Task<HttpResponseMessage?> UploadFileToServer(int productId, IBrowserFile file)
        {
            using var content = new MultipartFormDataContent();
            using var fileStream = file.OpenReadStream(maxAllowedSize: MaxFileSize);
            using var streamContent = new StreamContent(fileStream);
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

            // The second parameter "file" is the form field name on the server side
            content.Add(streamContent, "file", file.Name);

            var response = await _httpClient.PostAsync(ApiEndpoints.Manage.Product.Images.UploadToProductWithId(productId), content);
            return response;
        }
    }
}