using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class ProductVariantService
    {
        private readonly HttpClient _httpClient;

        public ProductVariantService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ProductVariantDto>?> GetVariantForProductId(int id)
        {
            var response = await _httpClient.GetAsync(ApiEndpoints.Public.Product.Variants.GetByProductId(id));

            if (!response.IsSuccessStatusCode)
            {
                // Return null to indicate an error or DB problem
                return null;
            }


            return await ApiServiceHelper.DeserializeResponse<List<ProductVariantDto>>(response);
        }
    }
}