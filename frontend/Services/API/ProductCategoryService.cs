using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class ProductCategoryService
    {
        private readonly HttpClient _httpClient;

        public ProductCategoryService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ProductCategoryDto>> GetProductCategoriesAsync()
        {
            var response = await _httpClient.GetAsync(ApiEndpoints.Public.ProductCategory.GetAll);

            return await ApiServiceHelper.DeserializeResponse<List<ProductCategoryDto>>(response);
        }

        public async Task<HttpResponseMessage> CreateNewProductCategoryAsync(NewProductCategoryDto dto)
        {
            var response = await _httpClient.PostAsJsonAsync(ApiEndpoints.Manage.ProductCategory.Create, dto);

            return response;
        }

        public async Task<HttpResponseMessage> DeleteProductCategoryAsync(int id)
        {
            return await _httpClient.DeleteAsync($"{ApiEndpoints.Manage.ProductCategory.Delete}/{id}");
        }
    }
}