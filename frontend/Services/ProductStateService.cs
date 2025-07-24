using frontend.Constants;
using frontend.DTOs;
using frontend.Handlers;
using frontend.Services.API;
using frontend.Shared;
using frontend.ViewModels;
using System.Collections.Frozen;

namespace frontend.Services
{
    /// <summary>
    /// Service to manage the state of product categories and size labels.
    /// </summary>
    public class ProductStateService : IDisposable
    {
        // Ready state for this service is when all data is loaded
        public LoadState LoadState = LoadState.Loading;

        // Dictionaries for fast lookup
        public FrozenDictionary<int, ProductCategoryDto> CategoriesDict { get; private set; } = FrozenDictionary<int, ProductCategoryDto>.Empty;
        public FrozenDictionary<int, ProductSizeLabelDto> SizeLabelsDict { get; private set; } = FrozenDictionary<int, ProductSizeLabelDto>.Empty;
        public FrozenDictionary<int, ProductLookupViewModel> ProductsDict { get; private set; } = FrozenDictionary<int, ProductLookupViewModel>.Empty;

        // Ordered lists for UI display
        public List<ProductCategoryDto> CategoriesListOrderedByTitle { get; private set; } = new();
        public List<ProductSizeLabelDto> SizeLabelsListOrderedByPriority { get; private set; } = new();
        public List<ProductLookupViewModel> ProductsListOrderedByReference { get; private set; } = new();

        // API Handlers for fetching data
        public ApiStateHandler<List<ProductCategoryDto>> CategoriesApiHandler { get; }
        public ApiStateHandler<List<ProductSizeLabelDto>> SizeLabelsApiHandler { get; }
        public ApiStateHandler<List<ProductDto>> ProductsApiHandler { get; }

        // Events
        public Action? CategoriesChanged { get; set; }
        public Action? SizeLabelsChanged { get; set; }
        public Action? ProductsChanged { get; set; }

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
            ProductsApiHandler = new ApiStateHandler<List<ProductDto>>(
                () => httpClient.GetAsync(ApiRoutes.Public.Products.GetAllShort));

            CategoriesApiHandler.StateHasChanged += UpdateCategories;
            SizeLabelsApiHandler.StateHasChanged += UpdateSizeLabels;
            ProductsApiHandler.StateHasChanged += UpdateProducts;
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

        public void UpdateProducts()
        {
            UpdateProductsWithList(null);
        }


        /// <summary>
        /// Updates the product state, optionally with a provided list.
        /// </summary>
        /// <param name="newProducts">If provided, uses this list; otherwise uses the content from ProductsApiHandler.</param>
        public void UpdateProductsWithList(List<ProductDto>? newProducts = null)
        {
            var products = newProducts
                ?? (ProductsApiHandler.IsSuccess() && ProductsApiHandler.Content != null
                    ? ProductsApiHandler.Content
                    : null);

            if (products != null)
            {
                var viewModels = products
                    .OrderBy(p => p.Reference)
                    .Select(dto => ProductLookupViewModel.FromDto(dto, this))
                    .ToList();

                ProductsListOrderedByReference = viewModels;
                ProductsDict = viewModels.ToFrozenDictionary(p => p.Id);
                ProductsChanged?.Invoke();
            }
        }

        /// <summary>
        /// Locally adds a product to the state and keeps the list ordered.
        /// </summary>
        /// <param name="product">The new product to add.</param>
        public void AddProductLocal(ProductDto product)
        {
            // Add to list
            var viewModel = ProductLookupViewModel.FromDto(product, this);
            ProductsListOrderedByReference.Add(viewModel);

            // Re-sort by Reference
            ProductsListOrderedByReference = ProductsListOrderedByReference
                .OrderBy(p => p.Reference)
                .ToList();

            // Update dictionary
            ProductsDict = ProductsListOrderedByReference.ToFrozenDictionary(p => p.Id);

            // Trigger update event for listeners
            ProductsChanged?.Invoke();
        }

        /// <summary>
        /// Removes a product by its ID from the local product state.
        /// </summary>
        /// <param name="productId">The ID of the product to remove.</param>
        public void RemoveProductLocal(int productId)
        {
            // Remove from the list
            ProductsListOrderedByReference = ProductsListOrderedByReference
                .Where(p => p.Id != productId)
                .OrderBy(p => p.Reference)
                .ToList();

            // Update the dictionary
            ProductsDict = ProductsListOrderedByReference.ToFrozenDictionary(p => p.Id);

            // Trigger update event for listeners
            ProductsChanged?.Invoke();
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

        /// <summary>
        /// Refetches the products from the API.
        /// </summary>
        public async Task RefetchProducts()
        {
            await ProductsApiHandler.ExecuteAsync();

            if (ProductsApiHandler.IsSuccess())
            {
                UpdateProducts();
            }
            else
            {
                notificationService.Display(ProductsApiHandler.GetErrorNotificationModel("Falha ao atualizar lista de produtos em ProductStateService."));
            }
        }

        public string GetProductFullReference(ProductDto product)
        {
            if (CategoriesDict.TryGetValue(product.CategoryId, out var cat))
                return $"{cat.Reference}-{product.Reference}";
            return $"??-{product.Reference}";
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
