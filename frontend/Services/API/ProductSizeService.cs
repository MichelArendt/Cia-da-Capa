using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    /// <summary>
    /// Service for managing product sizes.
    /// </summary>
    public class ProductSizeService
    {
        public event Action? ProductSizeAddedOrDeleted;
        public event Func<Task>? ProductSizesUpdated;

        /// <summary>
        /// Invokes the ProductSizeAddedOrDeleted event.
        /// </summary>
        public void InvokeProductSizeAddedOrDeleted() => ProductSizeAddedOrDeleted?.Invoke();

        /// <summary>
        /// Invokes the ProductSizesUpdated event.
        /// </summary>
        /// <returns>A task representing the asynchronous operation.</returns>
        public Task InvokeProductSizesUpdated() => ProductSizesUpdated?.Invoke() ?? Task.CompletedTask;

        private readonly HttpClient _httpClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProductSizeService"/> class.
        /// </summary>
        /// <param name="httpClient">The HTTP client.</param>
        public ProductSizeService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /// <summary>
        /// Gets the sizes for a product by its ID.
        /// </summary>
        /// <param name="id">The product ID.</param>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> GetSizesForProductId(int id)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.Sizes.GetSizesForProductId(id));
        }

        /// <summary>
        /// Creates a new product size.
        /// </summary>
        /// <param name="newProductSizeDto">The new product size DTO.</param>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> CreateProductSizeFunc(NewProductSizeDto newProductSizeDto)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Manage.Products.Sizes.CreateForProductId(newProductSizeDto.ProductId),
                newProductSizeDto,
                JsonHelper._options);
        }

        /// <summary>
        /// Updates an existing product size.
        /// </summary>
        /// <param name="productSizeDto">The product size DTO.</param>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> UpdateProductSizeFunc(ProductSizeDto productSizeDto)
        {
            return () => _httpClient.PutAsJsonAsync(
                ApiRoutes.Manage.ProductSizes.Update(productSizeDto.Id),
                productSizeDto,
                JsonHelper._options);
        }

        /// <summary>
        /// Deletes a product size by its ID.
        /// </summary>
        /// <param name="sizeId">The size ID.</param>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> DeleteProductSizeFunc(int sizeId)
        {
            return () => _httpClient.DeleteAsync(
                ApiRoutes.Manage.ProductSizes.Delete(sizeId));
        }
    }
}