using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class ProductSizeService
    {
        private readonly HttpClient _httpClient;

        public ProductSizeService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ProductSizeDto>?> GetSizesForProductId(int id)
        {
            var response = await _httpClient.GetAsync(NewApiEndpoints.Public.Product.ForId(id).Sizes);

            if (!response.IsSuccessStatusCode)
            {
                // Return null to indicate an error or DB problem
                return null;
            }


            return await ApiServiceHelper.DeserializeResponse<List<ProductSizeDto>>(response);
        }
    }
}