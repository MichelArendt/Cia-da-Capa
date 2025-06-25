using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    /// <summary>
    /// Service to handle API calls related to products.
    /// </summary>
    public class ProductService
    {
        private readonly HttpClient _httpClient;

        public ProductService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /// <summary>
        /// Gets the list of products.
        /// </summary>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> GetProductsListFunc()
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.GetAll);
        }

        /// <summary>
        /// Gets the list of filtered products.
        /// </summary>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> GetFilteredProductsListFunc(IDictionary<string, object?> filters)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.GetFiltered(filters));
        }

        /// <summary>
        /// Gets the list of highlighted products.
        /// </summary>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> GetHighlightedProductsListFunc()
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.GetAllHighlighted);
        }

        /// <summary>
        /// Gets a list of random highlighted products with images.
        /// </summary>
        /// <param name="limit">The maximum number of products to fetch (default: 10).</param>
        /// <param name="highlighted">If set, filters by highlighted products (default: true).</param>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> GetRandomHighlightedProductsWithImagesFunc(int limit = 10, bool? highlighted = true)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.GetRandomWithImages(limit, highlighted));
        }

        /// <summary>
        /// Creates a new product.
        /// </summary>
        /// <param name="product">The product to create.</param>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> CreateProductFunc(ProductFormDto product)
        {
            return () => _httpClient.PostAsJsonAsync(ApiRoutes.Manage.Products.Create, product, JsonHelper._options);
        }

        /// <summary>
        /// Updates an existing product.
        /// </summary>
        /// <param name="product">The product to update.</param>
        /// <param name="productId">The ID of the product to update.</param>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> UpdateProductFunc(ProductFormDto product, int productId)
        {
            return () => _httpClient.PutAsJsonAsync(ApiRoutes.Manage.Products.Update(productId), product, JsonHelper._options);
        }

        public Func<Task<HttpResponseMessage>> DeleteProductFunc(int productId)
        {
            return () => _httpClient.DeleteAsync(ApiRoutes.Manage.Products.Delete(productId));
        }

        public Func<Task<HttpResponseMessage>> GetFullProductDetailsFunc(int id)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.GetByIdFull(id));
        }

        /// <summary>
        /// Fetches images for a specific product.
        /// </summary>
        /// <param name="productId">The ID of the product.</param>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> FetchProductImagesFunc(int productId)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.Images.GetForProductId(productId));
        }

        /// <summary>
        /// Fetches images for a specific product variant.
        /// </summary>
        /// <param name="VariantId">The ID of the product variant.</param>
        /// <returns>A function that returns a task with the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> FetchProductVariantImagesFunc(int VariantId)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Products.Variants.Images.GetImagesForProductVariantId(VariantId));
        }
    }
}
