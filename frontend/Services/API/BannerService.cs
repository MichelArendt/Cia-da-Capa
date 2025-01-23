namespace frontend.Services.API
{
    public class BannerService
    {
        private readonly HttpClient _httpClient;

        public BannerService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
    }
}