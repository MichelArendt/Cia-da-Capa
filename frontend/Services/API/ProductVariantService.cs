using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    /// <summary>
    /// Service for managing product variants.
    /// </summary>
    public class ProductVariantService
    {
        /// <summary>
        /// Event triggered when a product variant is added or deleted.
        /// </summary>
        public event Action? ProductVariantAddedOrDeleted;

        /// <summary>
        /// Event triggered when product variants are updated.
        /// </summary>
        public event Func<Task>? ProductVariantsUpdated;

        /// <summary>
        /// Invokes the ProductVariantAddedOrDeleted event.
        /// </summary>
        public void InvokeProductVariantAddedOrDeleted() => ProductVariantAddedOrDeleted?.Invoke();

        /// <summary>
        /// Invokes the ProductVariantsUpdated event.
        /// </summary>
        public Task InvokeProductVariantsUpdated() => ProductVariantsUpdated?.Invoke() ?? Task.CompletedTask;

        private readonly HttpClient _httpClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProductVariantService"/> class.
        /// </summary>
        /// <param name="httpClient">The HTTP client.</param>
        public ProductVariantService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /// <summary>
        /// Gets the function to retrieve variants for a specific product ID.
        /// </summary>
        /// <param name="id">The product ID.</param>
        /// <returns>A function that retrieves the variants.</returns>
        public Func<Task<HttpResponseMessage>> GetVariantsForProductIdFunc(int id)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.Variants.GetForProductId(id));
        }

        /// <summary>
        /// Gets the function to create a new product variant.
        /// </summary>
        /// <param name="newProductVariantDto">The new product variant DTO.</param>
        /// <returns>A function that creates the product variant.</returns>
        public Func<Task<HttpResponseMessage>> CreateProductVariantFunc(NewProductVariantDto newProductVariantDto)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Manage.Products.Variants.CreateForProductId(newProductVariantDto.ProductId),
                newProductVariantDto,
                JsonHelper._options);
        }

        /// <summary>
        /// Gets the function to update an existing product variant.
        /// </summary>
        /// <param name="productVariant">The product variant DTO.</param>
        /// <returns>A function that updates the product variant.</returns>
        public Func<Task<HttpResponseMessage>> UpdateProductVariantFunc(ProductVariantDto productVariant)
        {
            return () => _httpClient.PutAsJsonAsync(
                ApiRoutes.Manage.ProductVariants.Update(productVariant.Id),
                productVariant,
                JsonHelper._options);
        }

        /// <summary>
        /// Gets the function to delete a product variant.
        /// </summary>
        /// <param name="variantId">The variant ID.</param>
        /// <returns>A function that deletes the product variant.</returns>
        public Func<Task<HttpResponseMessage>> DeleteProductVariantFunc(int variantId)
        {
            return () => _httpClient.DeleteAsync(
                ApiRoutes.Manage.ProductVariants.Delete(variantId));
        }
    }
}