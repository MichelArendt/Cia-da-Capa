using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class ProductVariantService
    {
        public event Action? ProductVariantAddedOrDeleted;
        public event Func<Task>? ProductVariantsUpdated;
        public void InvokeProductVariantAddedOrDeleted() => ProductVariantAddedOrDeleted?.Invoke();
        public Task InvokeProductVariantsUpdated() => ProductVariantsUpdated?.Invoke() ?? Task.CompletedTask;


        private readonly HttpClient _httpClient;

        public ProductVariantService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public Func<Task<HttpResponseMessage>> GetVariantsForProductIdFunc(int id)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.Variants.GetForProductId(id));
        }

        public Func<Task<HttpResponseMessage>> CreateNewProductVariantFunc(NewProductVariantDto newProductVariantDto)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Manage.Products.Variants.CreateForProductId(newProductVariantDto.ProductId),
                newProductVariantDto,
                JsonHelper._options);
        }

        public Func<Task<HttpResponseMessage>> UpdateProductVariantFunc(ProductVariantDto productVariant)
        {
            return () => _httpClient.PutAsJsonAsync(
                ApiRoutes.Manage.ProductVariants.Update(productVariant.Id),
                productVariant,
                JsonHelper._options);
        }

        public Func<Task<HttpResponseMessage>> DeleteProductVariantFunc(int variantId)
        {
            return () => _httpClient.DeleteAsync(
                ApiRoutes.Manage.ProductVariants.Delete(variantId));
        }

        //public async Task<List<ProductVariantDto>?> GetVariantsForProductIdFunc(int id)
        //{
        //    var response = await _httpClient.GetAsync(ApiRoutes.Public.Products.Variants.GetForProductId(id));

        //    if (!response.IsSuccessStatusCode)
        //    {
        //        // Return null to indicate an error or DB problem
        //        return null;
        //    }


        //    return await JsonHelper.Deserialize<List<ProductVariantDto>>(response);
        //}

        //public async Task<HttpResponseMessage> UpdateProductVariantFunc(ProductVariantDto productVariant)
        //{
        //    //return () => _httpClient.PutAsJsonAsync(
        //    //    ApiRoutes.Manage.ProductVariants.Update(productVariant.Id),
        //    //    productVariant,
        //    //    JsonHelper._options);

        //    var response = await _httpClient.PutAsJsonAsync(
        //        ApiRoutes.Manage.ProductVariants.Update(productVariant.Id),
        //        productVariant);

        //    if (response.IsSuccessStatusCode)
        //    {
        //        ProductVariantsUpdated?.Invoke();
        //    }

        //    return response;
        //}

        //public async Task<HttpResponseMessage> DeleteProductVariantFunc(int variantId)
        //{
        //    var response = await _httpClient.DeleteAsync(
        //        ApiRoutes.Manage.ProductVariants.Update(variantId));

        //    if (response.IsSuccessStatusCode)
        //    {
        //        ProductVariantsUpdated?.Invoke();
        //    }

        //    return response;
        //}
    }
}