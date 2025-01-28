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

        public async Task<HttpResponseMessage> CreateNewSizeLabelAsync(NewProductSizeLabelDto dto)
        {
            var response = await _httpClient.PostAsJsonAsync(ApiEndpoints.Manage.ProductSizeLabel.Create, dto);

            return response;
        }

        public async Task<HttpResponseMessage> DeleteProductSizeLabelAsync(int id)
        {
            return await _httpClient.DeleteAsync($"{ApiEndpoints.Manage.ProductSizeLabel.Delete}/{id}");
        }
    }
}