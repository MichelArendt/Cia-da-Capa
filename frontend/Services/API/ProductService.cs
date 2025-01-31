using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class ProductService
    {

        private readonly HttpClient _httpClient;

        public ProductService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ProductDto>> GetProductsAsync()
        {
            var response = await _httpClient.GetAsync(ApiEndpoints.Public.Product.GetAll);

            return await ApiServiceHelper.DeserializeResponse<List<ProductDto>>(response);
        }

        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync(ApiEndpoints.Public.Product.ById(id));

            return await ApiServiceHelper.DeserializeResponse<ProductDto>(response);
        }

        public async Task<HttpResponseMessage> CreateNewProductAsync(NewProductDto product)
        {
            return await _httpClient.PostAsJsonAsync(ApiEndpoints.Manage.Product.Create, product);
        }
    }
}
