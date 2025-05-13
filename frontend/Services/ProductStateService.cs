using frontend.Constants;
using frontend.DTOs;
using frontend.Handlers;
using frontend.Services.API;
using System.Collections.Frozen;

namespace frontend.Services
{
    /// <summary>
    /// Service to manage the state of product categories and size labels.
    /// </summary>
    public class ProductStateService : IDisposable
    {
        // Dictionaries for fast lookup
        public FrozenDictionary<int, ProductCategoryDto> CategoriesDict { get; private set; } = FrozenDictionary<int, ProductCategoryDto>.Empty;
        public FrozenDictionary<int, ProductSizeLabelDto> SizeLabelsDict { get; private set; } = FrozenDictionary<int, ProductSizeLabelDto>.Empty;

        // Lists ordered by priority or title for UI display
        public List<ProductCategoryDto> CategoriesListOrderedByTitle { get; private set; } = new();
        public List<ProductSizeLabelDto> SizeLabelsListOrderedByPriority { get; private set; } = new();

        public ApiStateHandler<List<ProductCategoryDto>> CategoriesApiHandler { get; }
        public ApiStateHandler<List<ProductSizeLabelDto>> SizeLabelsApiHandler { get; }

        public Action? CategoriesChanged { get; set; }
        public Action? SizeLabelsChanged { get; set; }

        private readonly NotificationService notificationService;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProductStateService"/> class.
        /// </summary>
        /// <param name="categoryService">The product category service.</param>
        /// <param name="sizeLabelService">The product size label service.</param>
        /// <param name="notificationService">The notification service.</param>
        /// <param name="httpClient">The HTTP client.</param>
        public ProductStateService(ProductCategoryService categoryService, ProductSizeLabelService sizeLabelService, NotificationService notificationService, HttpClient httpClient)
        {
            this.notificationService = notificationService;

            CategoriesApiHandler = new ApiStateHandler<List<ProductCategoryDto>>(
                () => httpClient.GetAsync(ApiRoutes.Public.Categories.GetAll));
            SizeLabelsApiHandler = new ApiStateHandler<List<ProductSizeLabelDto>>(
                () => httpClient.GetAsync(ApiRoutes.Public.SizeLabels.GetAll));

            CategoriesApiHandler.StateHasChanged += UpdateCategories;
            SizeLabelsApiHandler.StateHasChanged += UpdateSizeLabels;
        }

        /// <summary>
        /// Updates the categories state.
        /// </summary>
        public void UpdateCategories()
        {
            if (CategoriesApiHandler.IsSuccess() && CategoriesApiHandler.Content != null)
            {
                CategoriesListOrderedByTitle = CategoriesApiHandler.Content.OrderBy(c => c.Title).ToList();
                CategoriesDict = CategoriesListOrderedByTitle.ToFrozenDictionary(c => c.Id);
                CategoriesChanged?.Invoke();
            }
        }

        /// <summary>
        /// Updates the size labels state.
        /// </summary>
        public void UpdateSizeLabels()
        {
            if (SizeLabelsApiHandler.IsSuccess() && SizeLabelsApiHandler.Content != null)
            {
                SizeLabelsListOrderedByPriority = SizeLabelsApiHandler.Content.OrderBy(s => s.Priority).ToList();
                SizeLabelsDict = SizeLabelsListOrderedByPriority.ToFrozenDictionary(s => s.Id);
                SizeLabelsChanged?.Invoke();
            }
        }

        /// <summary>
        /// Refetches the categories from the API.
        /// </summary>
        public async Task RefetchCategories()
        {
            await CategoriesApiHandler.ExecuteAsync();

            if (CategoriesApiHandler.IsSuccess())
            {
                UpdateCategories();
            }
            else
            {
                notificationService.Display(CategoriesApiHandler.GetErrorNotificationModel("Falha ao tentar atualizar as categorias em ProductStateService."));
            }
        }

        /// <summary>
        /// Refetches the size labels from the API.
        /// </summary>
        public async Task RefetchSizeLabels()
        {
            await SizeLabelsApiHandler.ExecuteAsync();

            if (SizeLabelsApiHandler.IsSuccess())
            {
                UpdateSizeLabels();
            }
            else
            {
                notificationService.Display(SizeLabelsApiHandler.GetErrorNotificationModel("Falha ao tentar atualizar os rótulos de tamanho em ProductStateService."));
            }
        }
        public string GetProductFullReference(ProductDto product)
        {
            return $"{CategoriesDict[product.CategoryId].Reference}-{product.Reference}";
        }

        /// <summary>
        /// Disposes the service and unsubscribes from events.
        /// </summary>
        public void Dispose()
        {
            CategoriesApiHandler.StateHasChanged -= UpdateCategories;
            SizeLabelsApiHandler.StateHasChanged -= UpdateSizeLabels;
        }
    }
}
