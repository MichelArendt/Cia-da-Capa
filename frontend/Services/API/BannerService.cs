using frontend.Constants;
using frontend.DTOs;
using frontend.Handlers;
using frontend.Helpers;
using frontend.Models.Manage.Forms;
using Microsoft.AspNetCore.Components.Forms;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace frontend.Services.API
{
    public class BannerService
    {
        public static readonly long MaxFileSize = 5 * 1024 * 1024;

        private readonly HttpClient _httpClient;
        private readonly NotificationService _notificationService;

        //public ApiStateHandler<List<BannerDto>> GetAllBanners { get; private set; } = new();
        public ApiStateHandler<object> CreateBanner { get; private set; } = default!;
        public ApiStateHandler<object> UpdateBanner { get; private set; } = default!;
        public ApiStateHandler<object> UpdateImage { get; private set; } = default!;
        public ApiStateHandler<object> UpdateOrdering { get; private set; } = default!;
        //public ApiStateHandler<object> DeleteBanner { get; private set; } = default!;

        public BannerService(HttpClient httpClient, NotificationService notificationService)
        {
            _httpClient = httpClient;
            _notificationService = notificationService;
        }

        public Func<Task<HttpResponseMessage>> GetAllBannersFunc()
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Banners.GetAll);
        }
        public Func<Task<HttpResponseMessage>> GetByIdFunc(int id)
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Banners.GetById(id));
        }

        public Func<Task<HttpResponseMessage>> DeleteBannerFunc(int id)
        {
            return () => _httpClient.DeleteAsync(ApiRoutes.Manage.Banners.Delete(id));
        }

        public Func<Task<HttpResponseMessage>> UpdateOrderingFunc(List<BannerPriorityDto> list)
        {
            return () => _httpClient.PutAsJsonAsync(ApiRoutes.Manage.Banners.UpdateOrdering, list, JsonHelper._options);
        }

        public async Task CreateAsync(string title, int productId, IBrowserFile? mobile, IBrowserFile? tablet, IBrowserFile? desktop)
        {
            var content = new MultipartFormDataContent();
            content.Add(new StringContent(title), "title");
            content.Add(new StringContent(productId.ToString()), "product_id");

            AddFileToForm(content, "mobile", mobile);
            AddFileToForm(content, "tablet", tablet);
            AddFileToForm(content, "desktop", desktop);

            CreateBanner = new(() => _httpClient.PostAsync(ApiRoutes.Manage.Banners.Create, content));
            await CreateBanner.ExecuteAsync();
        }

        /// <summary>
        /// Create a new banner using the provided form model.
        /// </summary>
        public async Task CreateAsync(BannerFormModel model)
        {
            var content = BuildMultipartContent(model);

            CreateBanner = new(() => _httpClient.PostAsync(ApiRoutes.Manage.Banners.Create, content));
            await CreateBanner.ExecuteAsync();
        }

        /// <summary>
        /// Update an existing banner using the provided form model.
        /// </summary>
        public async Task UpdateAsync(int id, BannerFormModel model)
        {
            var content = BuildMultipartContent(model);
            //content.Add(new StringContent(id.ToString()), "id"); // Adjust according to backend if necessary.
            Console.WriteLine(content.ReadAsStringAsync().Result);


            UpdateBanner = new(() => _httpClient.PostAsync(ApiRoutes.Manage.Banners.Update(id), content));
            await UpdateBanner.ExecuteAsync();
        }

        /// <summary>
        /// Update a single image of a banner.
        /// </summary>
        public async Task UpdateSingleImageAsync(int id, IBrowserFile file, string size)
        {
            var content = new MultipartFormDataContent();
            AddFileToForm(content, "file", file);

            UpdateImage = new(() => _httpClient.PostAsync(ApiRoutes.Manage.Banners.UpdateImage(id, size), content));
            await UpdateImage.ExecuteAsync();
        }

        /// <summary>
        /// Builds MultipartFormDataContent from BannerFormModel.
        /// </summary>
        private MultipartFormDataContent BuildMultipartContent(BannerFormModel model)
        {
            var content = new MultipartFormDataContent();

            // Add string fields
            content.Add(new StringContent(model.ProductId?.ToString() ?? ""), "product_id");
            content.Add(new StringContent(model.Title ?? ""), "title");
            content.Add(new StringContent(model.Priority?.ToString() ?? ""), "priority");
            content.Add(new StringContent(model.ImagePathMobile ?? ""), "image_path_mobile");
            content.Add(new StringContent(model.ImagePathTablet ?? ""), "image_path_tablet");
            content.Add(new StringContent(model.ImagePathDesktop ?? ""), "image_path_desktop");

            // Add files if present (names should match your backend)
            if (model.FileMobile != null)
            {
                var stream = model.FileMobile.OpenReadStream();
                var fileContent = new StreamContent(stream);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(model.FileMobile.ContentType);
                content.Add(fileContent, "file_mobile", model.FileMobile.Name);
            }
            if (model.FileTablet != null)
            {
                var stream = model.FileTablet.OpenReadStream();
                var fileContent = new StreamContent(stream);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(model.FileTablet.ContentType);
                content.Add(fileContent, "file_tablet", model.FileTablet.Name);
            }
            if (model.FileDesktop != null)
            {
                var stream = model.FileDesktop.OpenReadStream();
                var fileContent = new StreamContent(stream);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(model.FileDesktop.ContentType);
                content.Add(fileContent, "file_desktop", model.FileDesktop.Name);
            }

            return content;
        }

        /// <summary>
        /// Adds file to multipart form content.
        /// </summary>
        private void AddFileToForm(MultipartFormDataContent content, string name, IBrowserFile? file)
        {
            if (file is null) return;

            var stream = file.OpenReadStream(MaxFileSize);
            var fileContent = new StreamContent(stream);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
            content.Add(fileContent, name, file.Name);
        }
    }
}
