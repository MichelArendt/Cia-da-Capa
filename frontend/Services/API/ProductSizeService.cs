using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class ProductSizeService
    {
        public event Action? ProductSizeAddedOrDeleted;
        public event Func<Task>? ProductSizesUpdated;
        public void InvokeProductSizeAddedOrDeleted() => ProductSizeAddedOrDeleted?.Invoke();
        public Task InvokeProductSizesUpdated() => ProductSizesUpdated?.Invoke() ?? Task.CompletedTask;

        private readonly HttpClient _httpClient;

        public ProductSizeService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        //public async Task<List<ProductSizeDto>?> GetSizesForProductId(int id)
        //{
        //    var response = await _httpClient.GetAsync(NewApiEndpoints.Public.Product.ById(id).Sizes);

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        // Return null to indicate an error or DB problem
        //        return null;
        //    }


        //    return await ApiServiceHelper.DeserializeResponse<List<ProductSizeDto>>(response);
        //}

        public Func<Task<HttpResponseMessage>> GetSizesForProductId(int id)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.Sizes.GetSizesForProductId(id));
        }

        public Func<Task<HttpResponseMessage>> CreateProductSizeFunc(NewProductSizeDto newProductSizeDto)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Manage.Products.Sizes.CreateForProductId(newProductSizeDto.ProductId),
                newProductSizeDto,
                JsonHelper._options);
        }

        public Func<Task<HttpResponseMessage>> UpdateProductSizeFunc(ProductSizeDto productSizeDto)
        {
            return () => _httpClient.PutAsJsonAsync(
                ApiRoutes.Manage.ProductSizes.Update(productSizeDto.Id),
                productSizeDto,
                JsonHelper._options);
        }

        public Func<Task<HttpResponseMessage>> DeleteProductSizeFunc(int sizeId)
        {
            return () => _httpClient.DeleteAsync(
                ApiRoutes.Manage.ProductSizes.Delete(sizeId));
        }
    }
}