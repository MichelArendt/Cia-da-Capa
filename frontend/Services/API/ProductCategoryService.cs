using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    /// <summary>
    /// Provides methods to interact with the product category API.
    /// </summary>
    public class ProductCategoryService
    {
        private readonly HttpClient _httpClient;

        public ProductCategoryService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /// <summary>
        /// Creates a new product category.
        /// </summary>
        /// <param name="dto">The data transfer object containing the details of the new product category.</param>
        /// <returns>A function that returns a task representing the asynchronous operation, containing the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> CreateProductCategoryFunc(NewProductCategoryDto dto)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Manage.ProductCategories.Create,
                dto,
                JsonHelper._options);
        }

        /// <summary>
        /// Updates an existing product category.
        /// </summary>
        /// <param name="dto">The data transfer object containing the updated product category details.</param>
        /// <returns>A function that returns a task representing the asynchronous operation.</returns>
        public Func<Task<HttpResponseMessage>> UpdateProductCategoryFunc(UpdateProductCategoryDto dto)
        {
            return () => _httpClient.PutAsJsonAsync(
                ApiRoutes.Manage.ProductCategories.Update(dto.Id),
                dto,
                JsonHelper._options);
        }

        /// <summary>
        /// Deletes a product category by its ID.
        /// </summary>
        /// <param name="categoryId">The ID of the product category to delete.</param>
        /// <returns>A function that returns a task representing the asynchronous operation, containing the HTTP response message.</returns>
        public Func<Task<HttpResponseMessage>> DeleteProductCategoryByIdFunc(int categoryId)
        {
            return () => _httpClient.DeleteAsync(ApiRoutes.Manage.ProductCategories.Delete(categoryId));
        }
    }
}