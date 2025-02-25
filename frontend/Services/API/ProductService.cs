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

        public async Task<HttpResponseMessage> CreateProductAsync(ProductFormDto product)
        {
            return await _httpClient.PostAsJsonAsync(ApiEndpoints.Manage.Product.Create, product, JsonHelper._options);
        }
        public Func<Task<HttpResponseMessage>> CreateProductFunc(ProductFormDto product)
        {
            return () => _httpClient.PostAsJsonAsync(ApiRoutes.Manage.Products.Create, product, JsonHelper._options);
        }

        public Func<Task<HttpResponseMessage>> UpdateProductFunc(ProductFormDto product, int productId)
        {
            return () => _httpClient.PutAsJsonAsync(ApiRoutes.Manage.Products.Update(productId), product, JsonHelper._options);
        }

        public async Task<List<ProductDto>> GetProductsAsync()
        {
            var response = await _httpClient.GetAsync(ApiEndpoints.Public.Product.GetAll);

            return await ApiServiceHelper.DeserializeResponse<List<ProductDto>>(response);
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync(ApiEndpoints.Public.Product.ById(id));

            return response.IsSuccessStatusCode ? await JsonHelper.Deserialize<ProductDto>(response) : null;
        }

        public async Task<ProductDto?> GetFullProductByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync(NewApiEndpoints.Public.Product.ById(id).Full);

            return response.IsSuccessStatusCode ? await JsonHelper.Deserialize<ProductDto>(response) : null;
        }

        public Func<Task<HttpResponseMessage>> FetchProductImagesFunc(int productId)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.Images.GetForProductId(productId));
        }

        public Func<Task<HttpResponseMessage>> FetchProductVariantImagesFunc(int VariantId)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.Variants.Images.GetImagesForProductVariantId(VariantId));
        }
    }
}
