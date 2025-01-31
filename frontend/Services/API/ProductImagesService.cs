using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class ProductImagesService
    {

        private readonly HttpClient _httpClient;

        public ProductImagesService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        //public async Task<ProductDto> GetProductImagesAsync(int id)
        //{
        //    var response = await _httpClient.GetAsync(ApiEndpoints.Public.Product.Images.GetAll + id);

        //    Console.WriteLine(response.Content.ReadAsStringAsync());

        //    return await ApiServiceHelper.DeserializeResponse<ProductDto>(response);
        //}
    }
}
