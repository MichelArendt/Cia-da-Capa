using frontend.Constants;
using frontend.DTOs;
using frontend.Handlers;
using frontend.Services.API;
using System.Collections.Frozen;

namespace frontend.Services
{
    public class ProductStateService : IDisposable
    {
        // Dictionaries for fast lookup
        public FrozenDictionary<int, ProductCategoryDto> CategoriesDict { get; private set; } = FrozenDictionary<int, ProductCategoryDto>.Empty;
        public FrozenDictionary<int, ProductSizeLabelDto> SizeLabelsDict { get; private set; } = FrozenDictionary<int, ProductSizeLabelDto>.Empty;

        // Lists ordered by priority or title for UI display
        public List<ProductCategoryDto> CategoriesListOrderedByTitle = new();
        public List<ProductSizeLabelDto> SizeLabelsListOrderedByPriority = new();


        public ApiStateHandler<List<ProductCategoryDto>> CategoriesApiHandler { get; }
        public ApiStateHandler<List<ProductSizeLabelDto>> SizeLabelsApiHandler { get; }

        public Action? CategoriesChanged { get; set; }
        public Action? SizeLabelsChanged { get; set; }

        //private readonly HttpClient _httpClient;
        private readonly NotificationService notificationService;

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

        public void UpdateCategories()
        {
            if (CategoriesApiHandler.IsSuccess() && CategoriesApiHandler.Content != null)
            {
                CategoriesListOrderedByTitle = CategoriesApiHandler.Content.OrderBy(c => c.Title).ToList();
                CategoriesDict = CategoriesListOrderedByTitle.ToFrozenDictionary(c => c.Id);
                CategoriesChanged?.Invoke();
            }
        }

        public void UpdateSizeLabels()
        {
            if (SizeLabelsApiHandler.IsSuccess() && SizeLabelsApiHandler.Content != null)
            {
                SizeLabelsListOrderedByPriority = SizeLabelsApiHandler.Content.OrderBy(s => s.Priority).ToList();
                SizeLabelsDict = SizeLabelsListOrderedByPriority.ToFrozenDictionary(s => s.Id);
                SizeLabelsChanged?.Invoke();
            }
        }

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

        public void Dispose()
        {
            CategoriesApiHandler.StateHasChanged -= UpdateCategories;
            SizeLabelsApiHandler.StateHasChanged -= UpdateSizeLabels;
        }
    }
}
