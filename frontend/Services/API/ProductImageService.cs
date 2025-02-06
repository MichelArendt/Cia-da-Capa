using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using Microsoft.AspNetCore.Components.Forms;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Net.Http.Json;

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

        public async Task<List<ProductImageDto>?> GetImagesForProductId(int id)
        {
            var response = await _httpClient.GetAsync(ApiEndpoints.Public.Product.Images.GetByProductId(id));

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine("ProductImageService 1");
                // Return null to indicate an error or DB problem
                return null;
            }


            Console.WriteLine("ProductImageService 2");
            Console.WriteLine(await response.Content.ReadAsStringAsync());
            return await JsonHelper.Deserialize<List<ProductImageDto>>(response);
            //return await ApiServiceHelper.DeserializeResponse<List<ProductImageDto>>(response);
        }

        public async Task<HttpResponseMessage?> DeleteImage(int imageId)
        {
            var response = await _httpClient.DeleteAsync(NewApiEndpoints.Manage.Product.Image.Delete(imageId));
            //var response = await _httpClient.GetAsync(NewApiEndpoints.Manage.Product.);
            Console.WriteLine("ProductImageService->DeleteImage " + NewApiEndpoints.Manage.Product.Image.Delete(imageId));

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine("ProductImageService->DeleteImage 1");
                // Return null to indicate an error or DB problem
                return null;
            }

            Console.WriteLine("ProductImageService->DeleteImage 2");
            Console.WriteLine(await response.Content.ReadAsStringAsync());
            return response;
            //return await ApiServiceHelper.DeserializeResponse<List<ProductImageDto>>(response);
        }

        public async Task<HttpResponseMessage?> UpdateOrdering(List<ProductImagePriorityDto> productImagePriorityDtoList)
        {
            Console.WriteLine(JsonHelper.Serialize<List<ProductImagePriorityDto>>(productImagePriorityDtoList));
            //return null;


            var response = await _httpClient.PostAsJsonAsync(
                NewApiEndpoints.Manage.Product.Image.UpdateOrdering, 
                JsonHelper.Serialize<List<ProductImagePriorityDto>>(productImagePriorityDtoList));

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine("ProductImageService->UpdateOrdering 1");
                // Return null to indicate an error or DB problem
                return null;
            }

            Console.WriteLine("ProductImageService->UpdateOrdering 2");
            Console.WriteLine(await response.Content.ReadAsStringAsync());
            return response;
        }
    }
}