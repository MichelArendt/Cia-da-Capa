using frontend.Constants;
using frontend.DTOs;
using frontend.Helpers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    /// <summary>
    /// Service for managing product size labels via API calls.
    /// </summary>
    public class ProductSizeLabelService
    {
        private readonly HttpClient _httpClient;

        public ProductSizeLabelService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        /// <summary>
        /// Creates a new product size label.
        /// </summary>
        /// <param name="dto">The data transfer object containing the new product size label details.</param>
        /// <returns>A function that returns a task representing the asynchronous operation.</returns>
        public Func<Task<HttpResponseMessage>> CreateProductSizeLabelFunc(NewProductSizeLabelDto dto)
        {
            return () => _httpClient.PostAsJsonAsync(
                ApiRoutes.Manage.ProductSizeLabels.Create,
                dto,
                JsonHelper._options);
        }

        /// <summary>
        /// Updates an existing product size label.
        /// </summary>
        /// <param name="dto">The data transfer object containing the updated product size label details.</param>
        /// <returns>A function that returns a task representing the asynchronous operation.</returns>
        public Func<Task<HttpResponseMessage>> UpdateProductSizeLabelFunc(UpdateProductSizeLabelDto dto)
        {
            return () => _httpClient.PutAsJsonAsync(
                ApiRoutes.Manage.ProductSizeLabels.Update(dto.Id),
                dto,
                JsonHelper._options);
        }

        /// <summary>
        /// Deletes a product size label by ID.
        /// </summary>
        /// <param name="id">The ID of the product size label to delete.</param>
        /// <returns>A function that returns a task representing the asynchronous operation.</returns>
        public Func<Task<HttpResponseMessage>> DeleteProductSizeLabelFunc(int id)
        {
            return () => _httpClient.DeleteAsync(ApiRoutes.Manage.ProductSizeLabels.Delete(id));
        }

        /// <summary>
        /// Updates the ordering of product size labels.
        /// </summary>
        /// <param name="updateProductSizeLabelOrderingDtos">The list of data transfer objects containing the updated ordering details.</param>
        /// <returns>A function that returns a task representing the asynchronous operation.</returns>
        public Func<Task<HttpResponseMessage>> UpdateOrderingFunc(List<UpdateProductSizeLabelOrderingDto> updateProductSizeLabelOrderingDtos)
        {
            return () => _httpClient.PutAsJsonAsync(
                ApiRoutes.Manage.ProductSizeLabels.UpdateOrdering,
                updateProductSizeLabelOrderingDtos,
                JsonHelper._options);
        }
    }
}