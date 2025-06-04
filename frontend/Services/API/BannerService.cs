using frontend.Constants;
using frontend.DTOs;
using frontend.Handlers;
using frontend.Helpers;
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

        public async Task CreateAsync(string title, IBrowserFile? mobile, IBrowserFile? tablet, IBrowserFile? desktop)
        {
            var content = new MultipartFormDataContent();
            content.Add(new StringContent(title), "title");

            AddFileToForm(content, "mobile", mobile);
            AddFileToForm(content, "tablet", tablet);
            AddFileToForm(content, "desktop", desktop);

            CreateBanner = new(() => _httpClient.PostAsync(ApiRoutes.Manage.Banners.Create, content));
            await CreateBanner.ExecuteAsync();
        }

        public async Task UpdateSingleImageAsync(int id, IBrowserFile file, string size)
        {
            var content = new MultipartFormDataContent();
            var stream = file.OpenReadStream(MaxFileSize);
            var streamContent = new StreamContent(stream);
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
            content.Add(streamContent, "file", file.Name);

            UpdateImage = new(() => _httpClient.PostAsync(ApiRoutes.Manage.Banners.UpdateImage(id, size), content));
            await UpdateImage.ExecuteAsync();

            stream.Dispose();
            streamContent.Dispose();
        }

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
