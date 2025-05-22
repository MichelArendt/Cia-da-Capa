using frontend.Constants;

namespace frontend.Services.API
{
    /// <summary>
    /// Service to handle user-related API requests.
    /// </summary>
    public class UtilsService
    {
        private readonly HttpClient _httpClient;

        public UtilsService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public Func<Task<HttpResponseMessage>> GetClientLogosFunc()
        {
            return () => _httpClient.GetAsync(ApiRoutes.Public.Utils.GetClientLogos);
        }
    }
}