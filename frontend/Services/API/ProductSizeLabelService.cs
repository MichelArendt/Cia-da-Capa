using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class ProductSizeLabelService
    {
        private readonly HttpClient _httpClient;

        public ProductSizeLabelService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ProductSizeLabelDto>?> GetProductSizeLabelsAsync()
        {
            var response = await _httpClient.GetAsync(ApiEndpoints.Public.ProductSizeLabel.GetAll);

            if (!response.IsSuccessStatusCode)
            {
                // Return null to indicate an error or DB problem
                return null;
            }


            return await ApiServiceHelper.DeserializeResponse<List<ProductSizeLabelDto>>(response);
        }

        public async Task<HttpResponseMessage> CreateNewProductSizeLabelAsync(NewProductSizeLabelDto dto)
        {
            var response = await _httpClient.PostAsJsonAsync(ApiEndpoints.Manage.ProductSizeLabel.Create, dto);

            return response;
        }

        public Func<Task<HttpResponseMessage>> CreateNewProductSizeLabelFunc(NewProductSizeLabelDto dto)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Manage.ProductSizeLabels.Create,
                dto,
                JsonHelper._options);
        }

        public Func<Task<HttpResponseMessage>> UpdateProductSizeLabelFunc(UpdateProductSizeLabelDto dto)
        {
            return () => _httpClient.PutAsJsonAsync(
                ApiRoutes.Manage.ProductSizeLabels.Update(dto.Id),
                dto,
                JsonHelper._options);
        }

        public async Task<HttpResponseMessage> DeleteProductSizeLabelAsync(int id)
        {
            return await _httpClient.DeleteAsync($"{ApiEndpoints.Manage.ProductSizeLabel.Delete}/{id}");
        }

        public Func<Task<HttpResponseMessage>> DeleteProductSizeLabelFunc(int id)
        {
            return () => _httpClient.DeleteAsync(ApiRoutes.Manage.ProductSizeLabels.Delete(id));
        }

        public Func<Task<HttpResponseMessage>> UpdateOrderingFunc(List<UpdateProductSizeLabelOrderingDto> updateProductSizeLabelOrderingDtos)
        {
            return () => _httpClient.PutAsJsonAsync(
                ApiRoutes.Manage.ProductSizeLabels.UpdateOrdering,
                updateProductSizeLabelOrderingDtos,
                JsonHelper._options);
        }

        public async Task<HttpResponseMessage?> UpdateOrderingFunc(List<ProductImageDto> productImageDtoList)
        {
            List<ProductImagePriorityDto> productImagePriorityDtoList = [];

            foreach (var image in productImageDtoList)
            {
                productImagePriorityDtoList.Add(new ProductImagePriorityDto
                {
                    Id = image.Id,
                    Priority = image.Priority
                });
            }

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